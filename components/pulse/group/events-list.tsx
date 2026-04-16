"use client";

import { useEffect, useRef, useState } from "react";

import { deleteEvent } from "@pulse/app/actions/events";
import { EventCard } from "@pulse/components/group/event-card";
import { isEventLockedAt } from "@pulse/lib/events";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";

type VoteRow = {
  user_id: string;
  vote: "yes" | "no" | "maybe";
  profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
};

type EventRow = {
  id: string;
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
  votes?: VoteRow[] | null;
};

type EventsListProps = {
  groupId: string;
  events: EventRow[];
  isAdmin: boolean;
  currentUserId: string;
  currentUserName: string;
  nextUpcomingEventId: string | null;
  referenceTimeMs: number;
};

export function EventsList({
  groupId,
  events,
  isAdmin,
  currentUserId,
  currentUserName,
  nextUpcomingEventId,
  referenceTimeMs,
}: EventsListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [optimisticEvents, setOptimisticEvents] = useState(events);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const optimisticAction = useOptimisticAction();

  useEffect(() => {
    setOptimisticEvents(events);
  }, [events]);

  const updateFadeState = (container: HTMLDivElement) => {
    setShowTopFade(container.scrollTop > 2);
    setShowBottomFade(container.scrollTop + container.clientHeight < container.scrollHeight - 2);
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!nextUpcomingEventId) {
      updateFadeState(container);
      return;
    }

    const primaryNode = container.querySelector<HTMLElement>(`[data-event-id="${nextUpcomingEventId}"]`);
    if (!primaryNode) {
      updateFadeState(container);
      return;
    }

    container.scrollTo({
      top: Math.max(0, primaryNode.offsetTop - 12),
      behavior: "auto",
    });
    updateFadeState(container);
  }, [nextUpcomingEventId]);

  const onDeleteEvent = (payload: {
    eventId: string;
    eventAt: string;
    recurrenceSeriesId: string | null;
    scope: "single" | "following" | "series";
  }) => {
    const previousEvents = optimisticEvents;
    optimisticAction.runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticEvents((current) => {
          if (!payload.recurrenceSeriesId || payload.scope === "single") {
            return current.filter((event) => event.id !== payload.eventId);
          }

          if (payload.scope === "series") {
            return current.filter((event) => event.recurrence_series_id !== payload.recurrenceSeriesId);
          }

          return current.filter(
            (event) =>
              event.recurrence_series_id !== payload.recurrenceSeriesId ||
              new Date(event.event_at).getTime() < new Date(payload.eventAt).getTime(),
          );
        });
        return previousEvents;
      },
      rollback: (state) => setOptimisticEvents(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("eventId", payload.eventId);
        formData.set("editScope", payload.scope);
        await deleteEvent(formData);
      },
      onErrorMessage: "Could not delete event(s). Reverted.",
    });
  };

  return (
    <div className="relative">
      {optimisticAction.errorMessage ? (
        <p className="mb-2 text-sm text-red-600">{optimisticAction.errorMessage}</p>
      ) : null}
      <div
        ref={containerRef}
        className="max-h-[50vh] space-y-3 overflow-y-auto pr-1"
        onScroll={(event) => updateFadeState(event.currentTarget)}
      >
        {optimisticEvents.map((event) => (
          <div key={event.id} data-event-id={event.id}>
            <EventCard
              groupId={groupId}
              event={event}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              referenceTimeMs={referenceTimeMs}
              isDimmed={isEventLockedAt(event.event_at, referenceTimeMs)}
              isPrimary={nextUpcomingEventId ? event.id === nextUpcomingEventId : false}
              onDeleteEvent={onDeleteEvent}
              isActionPending={optimisticAction.isPending}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-950/90 to-transparent transition-opacity ${
          showTopFade ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/90 to-transparent transition-opacity ${
          showBottomFade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
