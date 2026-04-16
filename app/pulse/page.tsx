import { redirect } from "next/navigation";

import { getProfile, getSessionUser } from "@pulse/lib/auth/session";

export default async function PulseIndexPage() {
  const user = await getSessionUser();

  if (!user) redirect("/pulse/login");

  const profile = await getProfile(user.id);
  if (!profile?.name) redirect("/pulse/profile");

  redirect("/pulse/dashboard");
}
