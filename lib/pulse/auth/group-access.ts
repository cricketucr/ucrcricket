import { redirect } from "next/navigation";

import { createClient } from "@pulse/lib/supabase/server";

export async function requireGroupMembership(groupId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle<{ role: "admin" | "member" }>();

  if (!data) {
    redirect("/pulse/dashboard?reason=not-group-member");
  }
  return data;
}

export async function requireGroupAdmin(groupId: string, userId: string) {
  const membership = await requireGroupMembership(groupId, userId);
  if (membership.role !== "admin") {
    redirect(`/pulse/groups/${groupId}`);
  }
  return membership;
}
