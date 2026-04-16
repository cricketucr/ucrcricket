export type EventWithTime = {
  id: string;
  event_at: string;
};

export const RECURRING_FREQUENCIES = ["none", "daily", "weekly", "weekly_custom", "monthly"] as const;
export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];

export const RECURRING_END_TYPES = ["never", "on_date"] as const;
export type RecurringEndType = (typeof RECURRING_END_TYPES)[number];

export type RecurrenceConfig = {
  frequency: RecurringFrequency;
  interval: number;
  weekdays: number[] | null;
  endType: RecurringEndType;
  untilDate: string | null;
};

export function toEpochMs(isoDateTime: string) {
  return new Date(isoDateTime).getTime();
}

export function isEventLockedAt(eventAtIso: string, referenceTimeMs: number) {
  return toEpochMs(eventAtIso) <= referenceTimeMs;
}

export function getNextUpcomingEventId(
  events: EventWithTime[],
  referenceTimeMs: number,
) {
  let nextUpcomingEvent: EventWithTime | null = null;

  for (const event of events) {
    const eventTimeMs = toEpochMs(event.event_at);
    if (eventTimeMs <= referenceTimeMs) {
      continue;
    }

    if (!nextUpcomingEvent || eventTimeMs < toEpochMs(nextUpcomingEvent.event_at)) {
      nextUpcomingEvent = event;
    }
  }

  return nextUpcomingEvent?.id ?? null;
}

export function addInterval(date: Date, frequency: RecurringFrequency, interval: number) {
  const nextDate = new Date(date);

  if (frequency === "daily") {
    nextDate.setDate(nextDate.getDate() + interval);
  } else if (frequency === "weekly") {
    nextDate.setDate(nextDate.getDate() + interval * 7);
  } else if (frequency === "monthly") {
    nextDate.setMonth(nextDate.getMonth() + interval);
  }

  return nextDate;
}

export function buildRecurringEventTimes(
  firstEventAtIso: string,
  recurrence: RecurrenceConfig,
  maxOccurrences = 52,
) {
  if (recurrence.frequency === "none") {
    return [firstEventAtIso];
  }

  const occurrences: string[] = [];
  const interval = Math.max(1, recurrence.interval);
  const untilBoundaryMs = recurrence.untilDate
    ? new Date(`${recurrence.untilDate}T23:59:59.999`).getTime()
    : null;

  if (recurrence.frequency === "weekly_custom") {
    const days = [...(recurrence.weekdays ?? [])]
      .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6)
      .sort((a, b) => a - b);
    if (days.length === 0) {
      return [];
    }

    const first = new Date(firstEventAtIso);
    const firstMs = first.getTime();
    if (Number.isNaN(firstMs)) {
      return [];
    }

    const startOfFirstWeek = new Date(first);
    startOfFirstWeek.setHours(0, 0, 0, 0);
    startOfFirstWeek.setDate(startOfFirstWeek.getDate() - startOfFirstWeek.getDay());
    const hour = first.getHours();
    const minute = first.getMinutes();
    const second = first.getSeconds();
    const millisecond = first.getMilliseconds();
    const intervalWeeks = Math.max(1, recurrence.interval);
    const dayCursor = new Date(first);
    dayCursor.setHours(0, 0, 0, 0);
    occurrences.push(first.toISOString());
    dayCursor.setDate(dayCursor.getDate() + 1);

    while (occurrences.length < maxOccurrences) {
      const currentWeekStart = new Date(dayCursor);
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
      const weekDiffMs = currentWeekStart.getTime() - startOfFirstWeek.getTime();
      const weekDistance = Math.floor(weekDiffMs / (1000 * 60 * 60 * 24 * 7));

      if (weekDistance >= 0 && weekDistance % intervalWeeks === 0 && days.includes(dayCursor.getDay())) {
        const candidate = new Date(dayCursor);
        candidate.setHours(hour, minute, second, millisecond);
        const candidateMs = candidate.getTime();
        if (untilBoundaryMs !== null && candidateMs > untilBoundaryMs) {
          break;
        }
        occurrences.push(candidate.toISOString());
      }

      dayCursor.setDate(dayCursor.getDate() + 1);
      if (untilBoundaryMs !== null && dayCursor.getTime() > untilBoundaryMs) {
        break;
      }
    }

    return occurrences;
  }

  let current = new Date(firstEventAtIso);

  while (occurrences.length < maxOccurrences) {
    const currentMs = current.getTime();
    if (Number.isNaN(currentMs)) {
      break;
    }

    if (untilBoundaryMs !== null && currentMs > untilBoundaryMs) {
      break;
    }

    occurrences.push(current.toISOString());
    current = addInterval(current, recurrence.frequency, interval);
  }

  return occurrences;
}

export function formatRecurrenceLabel(recurrence: {
  frequency: RecurringFrequency;
  interval: number;
  weekdays: number[] | null;
  endType: RecurringEndType;
  untilDate: string | null;
}) {
  if (recurrence.frequency === "none") {
    return null;
  }

  const everyLabel =
    recurrence.frequency === "weekly_custom"
      ? (() => {
          const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const chosenDays = [...(recurrence.weekdays ?? [])]
            .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
            .sort((a, b) => a - b)
            .map((day) => weekdayNames[day]);
          const base = recurrence.interval > 1 ? `Every ${recurrence.interval} weeks` : "Every week";
          if (chosenDays.length === 0) {
            return base;
          }
          return `${base} on ${chosenDays.join(", ")}`;
        })()
      : (() => {
          const unit =
            recurrence.frequency === "daily"
              ? "day"
              : recurrence.frequency === "weekly"
                ? "week"
                : "month";
          return recurrence.interval > 1 ? `Every ${recurrence.interval} ${unit}s` : `Every ${unit}`;
        })();
  if (recurrence.endType === "never") {
    return `${everyLabel}, no end date`;
  }

  if (!recurrence.untilDate) {
    return everyLabel;
  }

  const until = new Date(`${recurrence.untilDate}T00:00:00`);
  if (Number.isNaN(until.getTime())) {
    return everyLabel;
  }

  return `${everyLabel} until ${until.toLocaleDateString()}`;
}
