"use client";

import { deleteEvent, updateEvent } from "@pulse/app/actions/events";
import { Badge } from "@pulse/components/ui/badge";
import { VotePanel } from "@pulse/components/group/vote-panel";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Modal } from "@pulse/components/ui/modal";
import { EventForm } from "@pulse/components/group/event-form";
import { formatRecurrenceLabel, isEventLockedAt } from "@pulse/lib/events";
import { formatDateTime } from "@pulse/lib/utils";

type VoteRow = {
  user_id: string;
  vote: "yes" | "no" | "maybe";
  profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
};

type EventCardProps = {
  groupId: string;
  event: {
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
  isAdmin: boolean;
  currentUserId: string;
  currentUserName: string;
  referenceTimeMs: number;
  isDimmed?: boolean;
  isPrimary?: boolean;
  onDeleteEvent?: (payload: {
    eventId: string;
    eventAt: string;
    recurrenceSeriesId: string | null;
    scope: "single" | "following" | "series";
  }) => void;
  isActionPending?: boolean;
};

export function EventCard({
  groupId,
  event,
  isAdmin,
  currentUserId,
  currentUserName,
  referenceTimeMs,
  isDimmed = false,
  isPrimary = false,
  onDeleteEvent,
  isActionPending = false,
}: EventCardProps) {
  const isLocked = isEventLockedAt(event.event_at, referenceTimeMs);
  const votes = event.votes ?? [];
  const recurrenceLabel = formatRecurrenceLabel({
    frequency: event.recurrence_frequency,
    interval: event.recurrence_interval,
    weekdays: event.recurrence_weekdays,
    endType: event.recurrence_end_type,
    untilDate: event.recurrence_until_date,
  });

  return (
    <Card
      className={
        isPrimary
          ? "space-y-4 border-l-2 border-l-success border-t border-r border-b border-line bg-crease"
          : isDimmed
            ? "space-y-4 border-transparent bg-boundary opacity-70"
            : "space-y-4 border-transparent"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-wide text-white">{event.title}</h3>
          <p className="text-xs text-muted mt-0.5">{formatDateTime(event.event_at)}</p>
          {recurrenceLabel ? <p className="text-xs text-muted/60">{recurrenceLabel}</p> : null}
          {event.location ? (
            <p className="mt-1 text-xs text-muted uppercase tracking-widest">{event.location}</p>
          ) : null}
        </div>
        <Badge variant={isLocked ? "warning" : "success"}>
          {isLocked ? "Voting locked" : "Voting open"}
        </Badge>
      </div>

      {event.description ? (
        <details className="border border-line bg-boundary p-3">
          <summary className="cursor-pointer text-xs uppercase tracking-widest font-semibold text-muted hover:text-white transition-colors duration-200">
            Description
          </summary>
          <p className="mt-2 text-sm text-muted">{event.description}</p>
          {event.notes ? <p className="mt-2 text-xs text-muted/60">{event.notes}</p> : null}
        </details>
      ) : event.notes ? (
        <p className="text-xs text-muted">{event.notes}</p>
      ) : null}

      <VotePanel
        groupId={groupId}
        eventId={event.id}
        isLocked={isLocked}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        initialVotes={votes}
      />

      {isAdmin ? (
        <div className="flex flex-wrap gap-2 border-t border-line pt-3">
          <Modal title="Edit event" triggerLabel="Edit event">
            <EventForm
              groupId={groupId}
              event={event}
              action={updateEvent}
              submitLabel="Save event"
            />
          </Modal>
          <Modal title="Delete event" triggerLabel="Delete">
            <form
              action={deleteEvent}
              className="space-y-3"
              onSubmit={(eventFormSubmit) => {
                if (!onDeleteEvent) {
                  return;
                }
                eventFormSubmit.preventDefault();
                const formData = new FormData(eventFormSubmit.currentTarget);
                const scopeRaw = (formData.get("editScope") as string | null) ?? "single";
                const scope =
                  scopeRaw === "following" || scopeRaw === "series" ? scopeRaw : "single";
                onDeleteEvent({
                  eventId: event.id,
                  eventAt: event.event_at,
                  recurrenceSeriesId: event.recurrence_series_id,
                  scope,
                });
              }}
            >
              <input type="hidden" name="groupId" value={groupId} />
              <input type="hidden" name="eventId" value={event.id} />
              {event.recurrence_series_id ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor={`delete-scope-${event.id}`}>
                    Delete scope
                  </label>
                  <select
                    id={`delete-scope-${event.id}`}
                    name="editScope"
                    defaultValue="single"
                    className="h-10 w-full border border-line bg-boundary text-white px-3 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                  >
                    <option value="single">This event only</option>
                    <option value="following">This and following events</option>
                    <option value="series">Entire series</option>
                  </select>
                </div>
              ) : (
                <input type="hidden" name="editScope" value="single" />
              )}
              <Button type="submit" variant="danger" className="w-full" disabled={isActionPending}>
                Confirm delete
              </Button>
            </form>
          </Modal>
        </div>
      ) : null}
    </Card>
  );
}
