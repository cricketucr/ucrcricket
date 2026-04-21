"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireGroupAdmin } from "@pulse/lib/auth/group-access";
import { requireUser } from "@pulse/lib/auth/session";
import { getGroupMembership } from "@pulse/lib/db/queries";
import { createClient } from "@pulse/lib/supabase/server";

function getRequiredField(formData: FormData, field: string) {
  const value = (formData.get(field) as string | null) ?? "";
  if (!value) {
    throw new Error(`Missing ${field}.`);
  }
  return value;
}

export async function requestToJoinGroup(formData: FormData) {
  const user = await requireUser();
  const groupId = getRequiredField(formData, "groupId");

  const membership = await getGroupMembership(groupId, user.id);
  if (membership) {
    redirect(`/pulse/groups/${groupId}`);
  }

  const supabase = await createClient();
  const { data: group } = await supabase
    .from("groups")
    .select("id")
    .eq("id", groupId)
    .maybeSingle<{ id: string }>();

  if (!group) {
    throw new Error("Group not found.");
  }

  const { data: existingRequest } = await supabase
    .from("group_join_requests")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle<{ id: string }>();

  if (!existingRequest) {
    const { error } = await supabase.from("group_join_requests").insert({
      group_id: groupId,
      user_id: user.id,
      status: "pending",
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath(`/pulse/groups/${groupId}/request-access`);
  revalidatePath(`/pulse/groups/${groupId}/settings`);
  revalidatePath("/pulse/dashboard");
  redirect("/pulse/dashboard?reason=join-request-submitted");
}

export async function approveJoinRequest(formData: FormData) {
  const user = await requireUser();
  const groupId = getRequiredField(formData, "groupId");
  const requestId = getRequiredField(formData, "requestId");

  await requireGroupAdmin(groupId, user.id);

  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data: request, error: requestError } = await supabase
    .from("group_join_requests")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: nowIso,
    })
    .eq("id", requestId)
    .eq("group_id", groupId)
    .eq("status", "pending")
    .select("user_id")
    .maybeSingle<{ user_id: string }>();

  if (requestError) {
    throw new Error(requestError.message);
  }

  if (!request) {
    throw new Error("Join request is no longer pending.");
  }

  const { error: memberError } = await supabase.from("group_members").upsert(
    {
      group_id: groupId,
      user_id: request.user_id,
      role: "member",
    },
    { onConflict: "group_id,user_id" },
  );

  if (memberError) {
    throw new Error(memberError.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
  revalidatePath(`/pulse/groups/${groupId}/settings`);
  revalidatePath("/pulse/dashboard");
}

export async function denyJoinRequest(formData: FormData) {
  const user = await requireUser();
  const groupId = getRequiredField(formData, "groupId");
  const requestId = getRequiredField(formData, "requestId");

  await requireGroupAdmin(groupId, user.id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("group_join_requests")
    .update({
      status: "denied",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("group_id", groupId)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}/settings`);
}
