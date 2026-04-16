import { redirect } from "next/navigation";

import { createClient } from "@pulse/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(redirectTo = "/pulse/login") {
  const user = await getSessionUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function requireProfile(userId: string) {
  const profile = await getProfile(userId);
  if (!profile?.name) {
    redirect("/pulse/profile");
  }
  return profile;
}
