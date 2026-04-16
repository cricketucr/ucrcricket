"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireGroupAdmin } from "@pulse/lib/auth/group-access";
import { requireUser } from "@pulse/lib/auth/session";
import { createClient } from "@pulse/lib/supabase/server";

export async function createGroup(formData: FormData) {
  await requireUser();
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) throw new Error("Group name is required.");

  const supabase = await createClient();
  const { data: groupId, error: groupError } = await supabase.rpc("create_group_with_admin", { group_name: name });
  if (groupError || !groupId) throw new Error(groupError?.message ?? "Could not create group.");

  revalidatePath("/pulse/dashboard");
  redirect(`/pulse/groups/${groupId}`);
}

export async function deleteGroup(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const confirm = ((formData.get("confirm") as string | null) ?? "").trim();

  if (!groupId) throw new Error("Missing group.");
  await requireGroupAdmin(groupId, user.id);
  if (confirm !== "DELETE") throw new Error("Type DELETE to confirm.");

  const supabase = await createClient();
  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  if (error) throw new Error(error.message);

  revalidatePath("/pulse/dashboard");
  revalidatePath(`/pulse/groups/${groupId}`);
}
