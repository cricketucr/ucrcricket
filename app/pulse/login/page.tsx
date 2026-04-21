import { redirect } from "next/navigation";

import { startGoogleSignIn } from "@pulse/app/actions/auth";
import { getProfile, getSessionUser } from "@pulse/lib/auth/session";
import { ensurePulsePath } from "@pulse/lib/routing";
import { Button } from "@pulse/components/ui/button";

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
    <main className="relative flex min-h-screen w-full items-center justify-center px-4 py-10 bg-pitch overflow-hidden">
      {/* Background accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/20" />

      <div className="w-full max-w-sm">
        {/* Logo/brand */}
        <div className="mb-10 text-center">
          <p className="font-display text-5xl tracking-widest text-accent mb-1">PULSE</p>
          <p className="text-muted text-xs uppercase tracking-[0.25em]">by UCR Cricket</p>
        </div>

        <div className="border border-line bg-crease p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-0.5 h-4 bg-accent" />
              <h1 className="font-display text-xl tracking-wider text-white">SIGN IN</h1>
            </div>
            <p className="text-muted text-xs leading-relaxed pl-2.5">Manage groups, events, and votes with your team.</p>
          </div>

          <form action={startGoogleSignIn}>
            <input type="hidden" name="next" value={next} />
            <Button type="submit" className="w-full py-3">
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
