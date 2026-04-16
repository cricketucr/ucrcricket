import type { Metadata } from "next";

import { updateProfile } from "@pulse/app/actions/auth";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Input } from "@pulse/components/ui/input";
import { TimedToast } from "@pulse/components/ui/timed-toast";
import { TopNav } from "@pulse/components/top-nav";

export const metadata: Metadata = { title: "Settings · Pulse" };

type SettingsPageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const resolved = searchParams ? await searchParams : undefined;
  const showSavedToast = resolved?.saved === "1";

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      {showSavedToast ? (
        <TimedToast message="Your profile was updated." clearQueryParamOnHide="saved" />
      ) : null}
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-sm text-slate-400">Manage how you appear to others in Pulse.</p>
        </section>

        <Card className="space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Profile</h2>
          <form action={updateProfile} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Email</p>
              <p className="mt-1 text-sm text-slate-200">{user.email ?? "Not available"}</p>
              <p className="mt-1 text-xs text-slate-500">Your email comes from your sign-in provider and cannot be changed here.</p>
            </div>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Display name</label>
              <Input id="name" name="name" type="text" defaultValue={profile.name} required maxLength={80} className="mt-1" />
              <p className="mt-1 text-xs text-slate-500">Shown on member lists, votes, and event activity.</p>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </Card>
      </main>
    </>
  );
}
