import type { Metadata } from "next";

import { updateProfile } from "@pulse/app/actions/auth";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Input } from "@pulse/components/ui/input";
import { TimedToast } from "@pulse/components/ui/timed-toast";

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
      {showSavedToast ? (
        <TimedToast message="Your profile was updated." clearQueryParamOnHide="saved" />
      ) : null}
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
        <section className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-8 bg-accent" />
            <h1 className="font-display text-3xl tracking-wider text-white">SETTINGS</h1>
          </div>
          <p className="text-xs text-muted uppercase tracking-widest pl-3.5">Manage how you appear to others in Pulse.</p>
        </section>

        <Card className="space-y-5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted border-b border-line pb-3">Profile</p>
          <form action={updateProfile} className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Email</p>
              <p className="text-sm text-white mt-1">{user.email ?? "Not available"}</p>
              <p className="mt-1 text-xs text-muted/60">Your email comes from your sign-in provider and cannot be changed here.</p>
            </div>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-muted mb-1">Display name</label>
              <Input id="name" name="name" type="text" defaultValue={profile.name} required maxLength={80} className="mt-1" />
              <p className="mt-1 text-xs text-muted/60">Shown on member lists, votes, and event activity.</p>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </Card>
      </main>
    </>
  );
}
