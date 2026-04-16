"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@pulse/lib/auth/session";
import { requireGroupMembership } from "@pulse/lib/auth/group-access";
import { createClient } from "@pulse/lib/supabase/server";
import type { VoteValue } from "@pulse/lib/types";

const VALID_VOTES: VoteValue[] = ["yes", "no", "maybe"];

type CastVoteInput = {
  groupId: string;
  eventId: string;
  vote: VoteValue;
};

async function castVoteInternal({ groupId, eventId, vote }: CastVoteInput) {
  const user = await requireUser();

  if (!groupId || !eventId || !vote || !VALID_VOTES.includes(vote)) {
    throw new Error("Invalid vote request.");
  }

  await requireGroupMembership(groupId, user.id);

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("event_at")
    .eq("id", eventId)
    .eq("group_id", groupId)
    .maybeSingle<{ event_at: string }>();

  if (!event) {
    throw new Error("Event not found.");
  }

  if (new Date(event.event_at).getTime() <= Date.now()) {
    throw new Error("Voting has ended for this event.");
  }

  const { data: existingVote, error: existingVoteError } = await supabase
    .from("votes")
    .select("vote")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle<{ vote: VoteValue }>();

  if (existingVoteError) {
    throw new Error(existingVoteError.message);
  }

  let error: { message: string } | null = null;
  if (existingVote?.vote === vote) {
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);
    error = deleteError;
  } else {
    const { error: upsertError } = await supabase.from("votes").upsert(
      {
        user_id: user.id,
        event_id: eventId,
        vote,
      },
      { onConflict: "user_id,event_id" },
    );
    error = upsertError;
  }

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
}

export async function castVote(formData: FormData) {
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const eventId = (formData.get("eventId") as string | null) ?? "";
  const vote = (formData.get("vote") as VoteValue | null) ?? null;

  if (!vote) {
    throw new Error("Invalid vote request.");
  }

  await castVoteInternal({ groupId, eventId, vote });
}

export async function castVoteOptimistic(input: CastVoteInput) {
  await castVoteInternal(input);
}
