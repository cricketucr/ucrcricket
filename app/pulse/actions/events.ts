"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@pulse/lib/supabase/server";
import { requireUser } from "@pulse/lib/auth/session";
import { requireGroupAdmin } from "@pulse/lib/auth/group-access";
import {
  buildRecurringEventTimes,
  RECURRING_END_TYPES,
  RECURRING_FREQUENCIES,
  type RecurrenceConfig,
} from "@pulse/lib/events";

const EVENT_EDIT_SCOPES = ["single", "following", "series"] as const;
type EventEditScope = (typeof EVENT_EDIT_SCOPES)[number];
const SERIES_UPDATE_BATCH_SIZE = 25;

function getEventAt(formData: FormData) {
  const date = (formData.get("date") as string | null)?.trim();
  const time = (formData.get("time") as string | null)?.trim();
  if (!date || !time) {
    throw new Error("Date and time are required.");
  }

  const eventAt = new Date(`${date}T${time}`);
  if (Number.isNaN(eventAt.getTime())) {
    throw new Error("Invalid date or time.");
  }

  return eventAt.toISOString();
}

function getEventEditScope(formData: FormData): EventEditScope {
  const scopeRaw = (formData.get("editScope") as string | null) ?? "single";
  if (!EVENT_EDIT_SCOPES.includes(scopeRaw as EventEditScope)) {
    throw new Error("Invalid edit scope.");
  }
  return scopeRaw as EventEditScope;
}

function getRecurrenceConfig(formData: FormData, eventAtIso: string): RecurrenceConfig {
  const frequencyRaw = (formData.get("recurrenceFrequency") as string | null) ?? "none";
  const intervalRaw = (formData.get("recurrenceInterval") as string | null) ?? "1";
  const endTypeRaw = (formData.get("recurrenceEndType") as string | null) ?? "never";
  const untilDateRaw = (formData.get("recurrenceUntilDate") as string | null)?.trim() || null;

  if (!RECURRING_FREQUENCIES.includes(frequencyRaw as RecurrenceConfig["frequency"])) {
    throw new Error("Invalid recurrence frequency.");
  }

  if (!RECURRING_END_TYPES.includes(endTypeRaw as RecurrenceConfig["endType"])) {
    throw new Error("Invalid recurrence end type.");
  }

  const frequency = frequencyRaw as RecurrenceConfig["frequency"];
  const endType = endTypeRaw as RecurrenceConfig["endType"];

  const interval = Number.parseInt(intervalRaw, 10);
  if (Number.isNaN(interval) || interval < 1 || interval > 365) {
    throw new Error("Recurrence interval must be between 1 and 365.");
  }

  if (frequency === "none") {
    return {
      frequency: "none",
      interval: 1,
      weekdays: null,
      endType: "never",
      untilDate: null,
    };
  }

  const weekdays = formData
    .getAll("recurrenceWeekdays")
    .map((value) => Number.parseInt(String(value), 10))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6)
    .sort((a, b) => a - b);

  if (frequency === "weekly_custom" && weekdays.length === 0) {
    throw new Error("Select at least one weekday for custom weekly recurrence.");
  }

  if (endType === "on_date" && !untilDateRaw) {
    throw new Error("Recurrence end date is required.");
  }

  if (endType === "on_date" && untilDateRaw) {
    const untilDateMs = new Date(`${untilDateRaw}T23:59:59.999`).getTime();
    if (Number.isNaN(untilDateMs)) {
      throw new Error("Invalid recurrence end date.");
    }

    if (untilDateMs < new Date(eventAtIso).getTime()) {
      throw new Error("Recurrence end date must be on or after the first event date.");
    }
  }

  return {
    frequency,
    interval,
    weekdays: frequency === "weekly_custom" ? weekdays : null,
    endType,
    untilDate: endType === "on_date" ? untilDateRaw : null,
  };
}

export async function createEvent(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const eventAt = getEventAt(formData);
  const recurrence = getRecurrenceConfig(formData, eventAt);

  if (!groupId || !title) {
    throw new Error("Missing required fields.");
  }

  await requireGroupAdmin(groupId, user.id);
  const supabase = await createClient();
  const location = (formData.get("location") as string | null)?.trim() || null;
  const description = (formData.get("description") as string | null)?.trim() || null;
  const notes = (formData.get("notes") as string | null)?.trim() || null;
  const eventTimes = buildRecurringEventTimes(
    eventAt,
    recurrence,
    recurrence.endType === "never" ? 104 : 500,
  );
  const recurrenceSeriesId = recurrence.frequency === "none" ? null : crypto.randomUUID();
  const { error } = await supabase.from("events").insert(
    eventTimes.map((eventTime) => ({
      group_id: groupId,
      title,
      event_at: eventTime,
      location,
      description,
      notes,
      recurrence_series_id: recurrenceSeriesId,
      recurrence_frequency: recurrence.frequency,
      recurrence_interval: recurrence.interval,
      recurrence_weekdays: recurrence.weekdays,
      recurrence_end_type: recurrence.endType,
      recurrence_until_date: recurrence.untilDate,
      created_by: user.id,
    })),
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
}

export async function updateEvent(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const eventId = (formData.get("eventId") as string | null) ?? "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const eventAt = getEventAt(formData);
  const recurrence = getRecurrenceConfig(formData, eventAt);
  const scope = getEventEditScope(formData);

  if (!groupId || !eventId || !title) {
    throw new Error("Missing required fields.");
  }

  await requireGroupAdmin(groupId, user.id);
  const supabase = await createClient();
  const { data: sourceEvent, error: sourceError } = await supabase
    .from("events")
    .select("id, event_at, recurrence_series_id")
    .eq("id", eventId)
    .eq("group_id", groupId)
    .maybeSingle<{ id: string; event_at: string; recurrence_series_id: string | null }>();

  if (sourceError) {
    throw new Error(sourceError.message);
  }
  if (!sourceEvent) {
    throw new Error("Event not found.");
  }

  const location = (formData.get("location") as string | null)?.trim() || null;
  const description = (formData.get("description") as string | null)?.trim() || null;
  const notes = (formData.get("notes") as string | null)?.trim() || null;
  const newEventAtMs = new Date(eventAt).getTime();
  const sourceEventAtMs = new Date(sourceEvent.event_at).getTime();
  const shiftMs = newEventAtMs - sourceEventAtMs;
  const recurrenceSeriesId = recurrence.frequency === "none" ? null : sourceEvent.recurrence_series_id;

  if (!sourceEvent.recurrence_series_id || scope === "single") {
    const { error } = await supabase
      .from("events")
      .update({
        title,
        event_at: eventAt,
        location,
        description,
        notes,
        recurrence_series_id: recurrenceSeriesId,
        recurrence_frequency: recurrence.frequency,
        recurrence_interval: recurrence.interval,
        recurrence_weekdays: recurrence.weekdays,
        recurrence_end_type: recurrence.endType,
        recurrence_until_date: recurrence.untilDate,
      })
      .eq("id", eventId)
      .eq("group_id", groupId);

    if (error) {
      throw new Error(error.message);
    }
    revalidatePath(`/pulse/groups/${groupId}`);
    return;
  }

  let updateQuery = supabase
    .from("events")
    .select("id, event_at")
    .eq("group_id", groupId)
    .eq("recurrence_series_id", sourceEvent.recurrence_series_id);
  if (scope === "following") {
    updateQuery = updateQuery.gte("event_at", sourceEvent.event_at);
  }

  const { data: targets, error: targetsError } = await updateQuery;
  if (targetsError) {
    throw new Error(targetsError.message);
  }

  const updateRows = (targets ?? []).map((target) => {
    const shiftedMs = new Date(target.event_at).getTime() + shiftMs;
    const shiftedAt = new Date(shiftedMs).toISOString();
    return {
      id: target.id,
      title,
      event_at: shiftedAt,
      location,
      description,
      notes,
      recurrence_series_id: recurrenceSeriesId,
      recurrence_frequency: recurrence.frequency,
      recurrence_interval: recurrence.interval,
      recurrence_weekdays: recurrence.weekdays,
      recurrence_end_type: recurrence.endType,
      recurrence_until_date: recurrence.untilDate,
    };
  });

  for (let index = 0; index < updateRows.length; index += SERIES_UPDATE_BATCH_SIZE) {
    const batch = updateRows.slice(index, index + SERIES_UPDATE_BATCH_SIZE);
    const results = await Promise.all(
      batch.map((updateRow) =>
        supabase
          .from("events")
          .update({
            title: updateRow.title,
            event_at: updateRow.event_at,
            location: updateRow.location,
            description: updateRow.description,
            notes: updateRow.notes,
            recurrence_series_id: updateRow.recurrence_series_id,
            recurrence_frequency: updateRow.recurrence_frequency,
            recurrence_interval: updateRow.recurrence_interval,
            recurrence_weekdays: updateRow.recurrence_weekdays,
            recurrence_end_type: updateRow.recurrence_end_type,
            recurrence_until_date: updateRow.recurrence_until_date,
          })
          .eq("id", updateRow.id)
          .eq("group_id", groupId),
      ),
    );

    for (const result of results) {
      if (result.error) {
        throw new Error(result.error.message);
      }
    }
  }
  revalidatePath(`/pulse/groups/${groupId}`);
}

export async function deleteEvent(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const eventId = (formData.get("eventId") as string | null) ?? "";
  const scope = getEventEditScope(formData);

  if (!groupId || !eventId) {
    throw new Error("Missing required fields.");
  }

  await requireGroupAdmin(groupId, user.id);
  const supabase = await createClient();
  const { data: sourceEvent, error: sourceError } = await supabase
    .from("events")
    .select("id, event_at, recurrence_series_id")
    .eq("id", eventId)
    .eq("group_id", groupId)
    .maybeSingle<{ id: string; event_at: string; recurrence_series_id: string | null }>();

  if (sourceError) {
    throw new Error(sourceError.message);
  }
  if (!sourceEvent) {
    throw new Error("Event not found.");
  }

  let deleteQuery = supabase.from("events").delete().eq("group_id", groupId);
  if (!sourceEvent.recurrence_series_id || scope === "single") {
    deleteQuery = deleteQuery.eq("id", eventId);
  } else {
    deleteQuery = deleteQuery.eq("recurrence_series_id", sourceEvent.recurrence_series_id);
    if (scope === "following") {
      deleteQuery = deleteQuery.gte("event_at", sourceEvent.event_at);
    }
  }
  const { error } = await deleteQuery;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
}
