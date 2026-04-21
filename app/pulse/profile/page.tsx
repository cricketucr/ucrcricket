import { redirect } from "next/navigation";

import { saveProfile } from "@pulse/app/actions/auth";
import { getProfile, requireUser } from "@pulse/lib/auth/session";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Input } from "@pulse/components/ui/input";

export default async function ProfilePage() {
  const user = await requireUser("/pulse/login");
  const profile = await getProfile(user.id);

  if (profile?.name) redirect("/pulse/dashboard");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full space-y-4 p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-0.5 h-5 bg-accent" />
            <h1 className="font-display text-2xl tracking-wider text-white">COMPLETE PROFILE</h1>
          </div>
          <p className="text-xs text-muted uppercase tracking-widest pl-2.5">Add your name so teammates can identify your votes.</p>
        </div>
        <form action={saveProfile} className="space-y-3">
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-muted">Name</label>
          <Input id="name" name="name" type="text" placeholder="Your name" required maxLength={80} />
          <Button type="submit" className="w-full">Save and continue</Button>
        </form>
      </Card>
    </main>
  );
}
