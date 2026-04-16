"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@pulse/lib/supabase/server";
import { requireUser } from "@pulse/lib/auth/session";
import { ensurePulsePath } from "@pulse/lib/routing";

export async function startGoogleSignIn(formData: FormData) {
  const nextPath = ensurePulsePath((formData.get("next") as string | null) ?? null);
  const origin = (await headers()).get("origin");

  if (!origin) throw new Error("Could not determine request origin.");

  const supabase = await createClient();
  const callback = new URL("/pulse/auth/callback", origin);
  callback.searchParams.set("next", nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.toString() },
  });

  if (error || !data.url) throw new Error(error?.message ?? "Unable to start Google sign-in.");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/pulse/login");
}

export async function saveProfile(formData: FormData) {
  const user = await requireUser("/pulse/login");
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) throw new Error("Name is required.");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, name }, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/pulse/dashboard");
  redirect("/pulse/dashboard");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser("/pulse/login");
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) throw new Error("Name is required.");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, name }, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/pulse/settings");
  redirect("/pulse/settings?saved=1");
}
