"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@pulse/lib/supabase/client";

type GroupRealtimeSyncProps = {
  groupId: string;
  eventIds?: string[];
  includeVotes?: boolean;
  includeInvites?: boolean;
};

type RealtimeRecord = Record<string, unknown>;

function getPayloadRecord(payload: RealtimeRecord, key: "new" | "old") {
  const value = payload[key];
  return value && typeof value === "object" ? (value as RealtimeRecord) : null;
}

function getStringField(record: RealtimeRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : null;
}

export function GroupRealtimeSync({
  groupId,
  eventIds = [],
  includeVotes = false,
  includeInvites = false,
}: GroupRealtimeSyncProps) {
  const router = useRouter();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventIdSet = useMemo(() => new Set(eventIds), [eventIds]);

  useEffect(() => {
    const supabase = createClient();
    const channelName = `group-realtime:${groupId}:${includeInvites ? "settings" : "group"}`;
    const channel = supabase.channel(channelName);

    const scheduleRefresh = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        router.refresh();
      }, 250);
    };

    const onGroupScopedChange = (payload: RealtimeRecord) => {
      const nextGroupId = getStringField(getPayloadRecord(payload, "new"), "group_id");
      const prevGroupId = getStringField(getPayloadRecord(payload, "old"), "group_id");
      if (nextGroupId === groupId || prevGroupId === groupId) {
        scheduleRefresh();
      }
    };

    const onVoteChange = (payload: RealtimeRecord) => {
      if (eventIdSet.size === 0) {
        scheduleRefresh();
        return;
      }

      const nextEventId = getStringField(getPayloadRecord(payload, "new"), "event_id");
      const prevEventId = getStringField(getPayloadRecord(payload, "old"), "event_id");
      if (
        (nextEventId && eventIdSet.has(nextEventId)) ||
        (prevEventId && eventIdSet.has(prevEventId))
      ) {
        scheduleRefresh();
      }
    };

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "events",
        filter: `group_id=eq.${groupId}`,
      },
      onGroupScopedChange,
    );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "group_members",
        filter: `group_id=eq.${groupId}`,
      },
      onGroupScopedChange,
    );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "group_membership_history",
        filter: `group_id=eq.${groupId}`,
      },
      onGroupScopedChange,
    );

    if (includeInvites) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invites",
          filter: `group_id=eq.${groupId}`,
        },
        onGroupScopedChange,
      );
    }

    if (includeVotes) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        onVoteChange,
      );
    }

    channel.subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [eventIdSet, groupId, includeInvites, includeVotes, router]);

  return null;
}
