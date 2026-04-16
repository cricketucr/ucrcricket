"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@pulse/lib/auth/session";
import { requireGroupAdmin } from "@pulse/lib/auth/group-access";
import { createClient } from "@pulse/lib/supabase/server";

export async function createInvite(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const expiresInOption = (formData.get("expiresInOption") as string | null) ?? "7d";

  if (!groupId) {
    throw new Error("Missing group id.");
  }

  await requireGroupAdmin(groupId, user.id);

  const token = crypto.randomBytes(20).toString("hex");
  const expiresAt = new Date();
  const expirationDaysByOption: Record<string, number> = {
    "1d": 1,
    "3d": 3,
    "7d": 7,
    "14d": 14,
    "30d": 30,
  };
  const expiresInDays = expirationDaysByOption[expiresInOption] ?? 7;
  const expiresAtIso =
    expiresInOption === "never"
      ? null
      : (() => {
          expiresAt.setDate(expiresAt.getDate() + expiresInDays);
          return expiresAt.toISOString();
        })();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invites")
    .insert({
      group_id: groupId,
      token,
      expires_at: expiresAtIso,
      created_by: user.id,
    })
    .select("id, token, expires_at")
    .single<{ id: string; token: string; expires_at: string | null }>();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);

  return data;
}

export async function deleteInvite(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const inviteId = (formData.get("inviteId") as string | null) ?? "";

  if (!groupId || !inviteId) {
    throw new Error("Missing required fields.");
  }

  await requireGroupAdmin(groupId, user.id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("invites")
    .delete()
    .eq("id", inviteId)
    .eq("group_id", groupId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
}

export async function joinGroupFromInvite(formData: FormData) {
  await requireUser();
  const token = (formData.get("token") as string | null) ?? "";

  if (!token) {
    throw new Error("Invite token is required.");
  }

  const supabase = await createClient();
  const { data: groupId, error } = await supabase.rpc("join_group_from_invite", {
    invite_token: token,
  });

  if (error || !groupId) {
    throw new Error(error?.message ?? "Unable to join group from invite.");
  }

  revalidatePath(`/pulse/groups/${groupId}`);
  redirect(`/pulse/groups/${groupId}`);
}
