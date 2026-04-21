import { createClient } from "@pulse/lib/supabase/server";
import type { GroupJoinRequest, GroupMember, VoteValue } from "@pulse/lib/types";
import { isEventLockedAt } from "@pulse/lib/events";

type DbVoteRow = {
  user_id: string;
  event_id: string;
  vote: VoteValue;
  updated_at: string;
  profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
};

type DbEventRow = {
  id: string;
  group_id: string;
  title: string;
  event_at: string;
  location: string | null;
  description: string | null;
  notes: string | null;
  recurrence_series_id: string | null;
  recurrence_frequency: "none" | "daily" | "weekly" | "weekly_custom" | "monthly";
  recurrence_interval: number;
  recurrence_weekdays: number[] | null;
  recurrence_end_type: "never" | "on_date";
  recurrence_until_date: string | null;
  created_by: string;
  created_at: string;
  votes?: DbVoteRow[] | null;
};

export async function getUserGroups(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_members")
    .select("role, groups(id, name, created_by, created_at)")
    .eq("user_id", userId)
    .order("created_at", { referencedTable: "groups", ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((entry: { role: string; groups: unknown }) => ({
    role: entry.role,
    group: entry.groups,
  }));
}

export async function getGroupMembership(groupId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_members")
    .select("user_id, group_id, role, joined_at")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle<GroupMember>();

  return data;
}

export async function getGroupWithMembers(groupId: string) {
  const supabase = await createClient();
  const referenceTimeMs = Date.now();

  const [
    { data: group },
    { data: members },
    { data: invites },
    { data: joinRequests },
    { data: events },
    { data: membershipHistory },
  ] =
    await Promise.all([
      supabase.from("groups").select("id, name, created_by, created_at").eq("id", groupId).maybeSingle(),
      supabase
        .from("group_members")
        .select("user_id, group_id, role, joined_at, profiles(id, name)")
        .eq("group_id", groupId)
        .order("joined_at", { ascending: true }),
      supabase
        .from("invites")
        .select("id, group_id, token, expires_at, created_by, created_at")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false }),
      supabase
        .from("group_join_requests")
        .select("id, group_id, user_id, status, created_at, reviewed_at, reviewed_by, profiles(id, name)")
        .eq("group_id", groupId)
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("events")
        .select(
          "id, group_id, title, event_at, location, description, notes, recurrence_series_id, recurrence_frequency, recurrence_interval, recurrence_weekdays, recurrence_end_type, recurrence_until_date, created_by, created_at, votes(user_id, event_id, vote, updated_at, profiles(id, name))",
        )
        .eq("group_id", groupId),
      supabase
        .from("group_membership_history")
        .select("user_id, action, created_at")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false }),
    ]);

  if (!group) {
    return null;
  }

  const activeMemberIds = new Set((members ?? []).map((member: { user_id: string }) => member.user_id));
  const historyByUser = (membershipHistory ?? []).reduce(
    (
      acc: Record<string, Array<{ action: "joined" | "kicked"; created_at: string }>>,
      row: { user_id: string; action: "joined" | "kicked"; created_at: string },
    ) => {
      if (!acc[row.user_id]) {
        acc[row.user_id] = [];
      }
      acc[row.user_id].push({ action: row.action, created_at: row.created_at });
      return acc;
    },
    {},
  );

  const wasMemberAtTime = (userId: string, lockTimeIso: string, voteUpdatedAtIso: string) => {
    const userHistory = historyByUser[userId] ?? [];
    const lockMs = new Date(lockTimeIso).getTime();
    let memberAtLock = activeMemberIds.has(userId);

    for (const historyRow of userHistory) {
      const eventMs = new Date(historyRow.created_at).getTime();
      if (eventMs <= lockMs) {
        break;
      }

      if (historyRow.action === "joined") {
        memberAtLock = false;
      } else if (historyRow.action === "kicked") {
        memberAtLock = true;
      }
    }

    if (memberAtLock) {
      return true;
    }

    const voteUpdatedMs = new Date(voteUpdatedAtIso).getTime();
    if (voteUpdatedMs > lockMs) {
      return false;
    }

    let hasBlockingKick = false;
    for (let index = userHistory.length - 1; index >= 0; index -= 1) {
      const row = userHistory[index];
      const rowMs = new Date(row.created_at).getTime();
      if (rowMs > lockMs) {
        continue;
      }

      if (row.action === "kicked") {
        hasBlockingKick = true;
      } else if (row.action === "joined") {
        hasBlockingKick = false;
      }
    }

    return !hasBlockingKick;
  };

  const filteredEvents = ((events ?? []) as DbEventRow[]).map((event) => {
    const isLocked = isEventLockedAt(event.event_at, referenceTimeMs);
    const filteredVotes = (event.votes ?? []).filter((vote) =>
      isLocked
        ? wasMemberAtTime(vote.user_id, event.event_at, vote.updated_at)
        : activeMemberIds.has(vote.user_id),
    );

    return {
      ...event,
      votes: filteredVotes,
    };
  });

  const sortedEvents = filteredEvents.sort((a: { event_at: string }, b: { event_at: string }) => {
    const aTs = new Date(a.event_at).getTime();
    const bTs = new Date(b.event_at).getTime();
    return aTs - bTs;
  });

  return {
    group,
    members: members ?? [],
    invites: invites ?? [],
    joinRequests: (joinRequests ?? []) as GroupJoinRequest[],
    events: sortedEvents,
    referenceTimeMs,
  };
}

export function getVoteSummary(
  votes: Array<{
    vote: VoteValue;
    profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
  }>,
) {
  const initial = {
    yes: [] as Array<{ id: string; name: string }>,
    no: [] as Array<{ id: string; name: string }>,
    maybe: [] as Array<{ id: string; name: string }>,
  };

  return votes.reduce((acc, current) => {
    if (current.profiles) {
      const profile = Array.isArray(current.profiles)
        ? current.profiles[0]
        : current.profiles;
      if (profile) {
        acc[current.vote].push(profile);
      }
    }
    return acc;
  }, initial);
}
