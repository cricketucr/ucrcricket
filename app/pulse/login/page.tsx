import { redirect } from "next/navigation";

import { startGoogleSignIn } from "@pulse/app/actions/auth";
import { getProfile, getSessionUser } from "@pulse/lib/auth/session";
import { ensurePulsePath } from "@pulse/lib/routing";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSessionUser();
  const params = await searchParams;
  const next = ensurePulsePath(params.next);

  if (user) {
    const profile = await getProfile(user.id);
    redirect(profile?.name ? next : "/pulse/profile");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full space-y-4 p-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white">Pulse</h1>
          <p className="text-sm text-slate-400">Sign in with Google to manage groups, events, and votes.</p>
        </div>
        <form action={startGoogleSignIn}>
          <input type="hidden" name="next" value={next} />
          <Button type="submit" className="w-full">Continue with Google</Button>
        </form>
      </Card>
    </main>
  );
}
