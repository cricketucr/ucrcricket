"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@pulse/lib/auth/session";
import { requireGroupAdmin } from "@pulse/lib/auth/group-access";
import { createClient } from "@pulse/lib/supabase/server";

export async function removeMember(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const memberId = (formData.get("memberId") as string | null) ?? "";

  if (!groupId || !memberId) {
    throw new Error("Missing required fields.");
  }

  await requireGroupAdmin(groupId, user.id);

  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_member_from_group", {
    target_group_id: groupId,
    target_member_id: memberId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
}

export async function updateMemberRole(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const memberId = (formData.get("memberId") as string | null) ?? "";
  const role = (formData.get("role") as string | null) ?? "";

  if (!groupId || !memberId) {
    throw new Error("Missing required fields.");
  }

  if (role !== "admin" && role !== "member") {
    throw new Error("Invalid role.");
  }

  await requireGroupAdmin(groupId, user.id);

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_group_member_role", {
    target_group_id: groupId,
    target_member_id: memberId,
    new_role: role,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/pulse/groups/${groupId}`);
  revalidatePath(`/pulse/groups/${groupId}/settings`);
}
