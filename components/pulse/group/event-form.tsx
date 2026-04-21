"use client";

import { useState, useTransition } from "react";

import { Button } from "@pulse/components/ui/button";
import { Input } from "@pulse/components/ui/input";
import { useModalControls } from "@pulse/components/ui/modal";
import { RECURRING_END_TYPES, RECURRING_FREQUENCIES } from "@pulse/lib/events";
import { toDateInputValue, toTimeInputValue } from "@pulse/lib/utils";

type EventFormProps = {
  groupId: string;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  event?: {
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
  };
  onSuccess?: () => void;
};

export function EventForm({ groupId, action, submitLabel, event, onSuccess }: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalControls = useModalControls();
  const [frequency, setFrequency] = useState(event?.recurrence_frequency ?? "none");
  const [endType, setEndType] = useState(event?.recurrence_end_type ?? "never");
  const selectedWeekdays = new Set(event?.recurrence_weekdays ?? []);

  const handleSubmit = (formData: FormData) => {
    setErrorMessage(null);
    const dateValue = (formData.get("date") as string | null)?.trim();
    const timeValue = (formData.get("time") as string | null)?.trim();
    if (dateValue && timeValue) {
      const [yearRaw, monthRaw, dayRaw] = dateValue.split("-");
      const [hoursRaw, minutesRaw] = timeValue.split(":");
      const year = Number.parseInt(yearRaw ?? "", 10);
      const month = Number.parseInt(monthRaw ?? "", 10);
      const day = Number.parseInt(dayRaw ?? "", 10);
      const hours = Number.parseInt(hoursRaw ?? "", 10);
      const minutes = Number.parseInt(minutesRaw ?? "", 10);
      if (Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day) && Number.isInteger(hours) && Number.isInteger(minutes)) {
        const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
        if (!Number.isNaN(localDate.getTime())) {
          formData.set("timezoneOffsetMinutes", String(localDate.getTimezoneOffset()));
        }
      }
    }
    startTransition(async () => {
      try {
        await action(formData);
        onSuccess?.();
        if (!onSuccess) {
          modalControls?.closeModal();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save event.";
        setErrorMessage(message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <input type="hidden" name="groupId" value={groupId} />
      {event ? <input type="hidden" name="eventId" value={event.id} /> : null}
      {event && event.recurrence_series_id ? (
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="editScope">
            Apply changes to
          </label>
          <select
            id="editScope"
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

      <label className="block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="title">
        Title
      </label>
      <Input
        id="title"
        name="title"
        placeholder="e.g. Team sync downtown"
        defaultValue={event?.title ?? ""}
        required
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="date">
            Date
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={event ? toDateInputValue(event.event_at) : ""}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="time">
            Time
          </label>
          <Input
            id="time"
            name="time"
            type="time"
            defaultValue={event ? toTimeInputValue(event.event_at) : ""}
            required
          />
        </div>
      </div>

      <div className="space-y-2 border border-line p-3">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="recurrenceFrequency">
          Repeat
        </label>
        <select
          id="recurrenceFrequency"
          name="recurrenceFrequency"
          value={frequency}
          onChange={(event) => setFrequency(event.target.value as (typeof RECURRING_FREQUENCIES)[number])}
          className="h-10 w-full border border-line bg-boundary text-white px-3 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
        >
          {RECURRING_FREQUENCIES.map((option) => (
            <option key={option} value={option}>
              {option === "none"
                ? "Does not repeat"
                : option === "weekly_custom"
                  ? "Custom weekly days"
                  : option[0].toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        {frequency !== "none" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="recurrenceInterval">
                Every
              </label>
              <Input
                id="recurrenceInterval"
                name="recurrenceInterval"
                type="number"
                min={1}
                max={365}
                defaultValue={event?.recurrence_interval ?? 1}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="recurrenceEndType">
                Ends
              </label>
              <select
                id="recurrenceEndType"
                name="recurrenceEndType"
                value={endType}
                onChange={(event) => setEndType(event.target.value as (typeof RECURRING_END_TYPES)[number])}
                className="h-10 w-full border border-line bg-boundary text-white px-3 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
              >
                {RECURRING_END_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option === "never" ? "Never" : "On date"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            <input type="hidden" name="recurrenceInterval" value="1" />
            <input type="hidden" name="recurrenceEndType" value="never" />
            <input type="hidden" name="recurrenceWeekdays" value="" />
          </>
        )}

        {frequency === "weekly_custom" ? (
          <div>
            <p className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">Days of week</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {[
                { value: 0, label: "Sun" },
                { value: 1, label: "Mon" },
                { value: 2, label: "Tue" },
                { value: 3, label: "Wed" },
                { value: 4, label: "Thu" },
                { value: 5, label: "Fri" },
                { value: 6, label: "Sat" },
              ].map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2 border border-line px-2 py-1 text-xs text-muted hover:border-accent/30 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="recurrenceWeekdays"
                    value={day.value}
                    defaultChecked={selectedWeekdays.has(day.value)}
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {frequency !== "none" && endType === "on_date" ? (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="recurrenceUntilDate">
              Repeat until
            </label>
            <Input
              id="recurrenceUntilDate"
              name="recurrenceUntilDate"
              type="date"
              defaultValue={event?.recurrence_until_date ?? ""}
              required
            />
          </div>
        ) : null}
      </div>

      <label className="block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="location">
        Location
      </label>
      <Input
        id="location"
        name="location"
        placeholder="Optional"
        defaultValue={event?.location ?? ""}
      />

      <label className="block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="description">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        defaultValue={event?.description ?? ""}
        className="min-h-20 w-full border border-line bg-boundary text-white px-3 py-2 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200 placeholder:text-muted"
      />

      <label className="block text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="notes">
        Notes
      </label>
      <textarea
        id="notes"
        name="notes"
        defaultValue={event?.notes ?? ""}
        className="min-h-20 w-full border border-line bg-boundary text-white px-3 py-2 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200 placeholder:text-muted"
      />

      {errorMessage ? <p className="text-xs text-danger border-l-2 border-danger pl-3 py-1">{errorMessage}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {submitLabel}
      </Button>
    </form>
  );
}
