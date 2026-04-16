import Link from "next/link";
import { redirect } from "next/navigation";

import { joinGroupFromInvite } from "@pulse/app/actions/invites";
import { getProfile, getSessionUser } from "@pulse/lib/auth/session";
import { createClient } from "@pulse/lib/supabase/server";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const user = await getSessionUser();

  if (!user) redirect(`/pulse/login?next=/pulse/invite/${token}`);

  const profile = await getProfile(user.id);
  if (!profile?.name) redirect("/pulse/profile");

  const supabase = await createClient();
  const { data: previewRows } = await supabase.rpc("get_invite_preview", { invite_token: token });
  const invite = (previewRows ?? [])[0] as
    | { invite_id: string; group_id: string; group_name: string; expires_at: string | null }
    | undefined;

  if (invite) {
    const { data: membership } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("group_id", invite.group_id)
      .eq("user_id", user.id)
      .maybeSingle<{ group_id: string }>();

    if (membership) redirect(`/pulse/groups/${invite.group_id}`);
  }

  const nowMs = Date.parse(new Date().toISOString());
  const isExpired =
    !invite || (invite.expires_at ? new Date(invite.expires_at).getTime() < nowMs : false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full space-y-4 p-6">
        {isExpired ? (
          <>
            <h1 className="text-xl font-semibold text-white">Invite not available</h1>
            <p className="text-sm text-slate-400">This invite link is invalid or has expired.</p>
            <Link
              href="/pulse/dashboard"
              className="block rounded-md transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Button type="button" className="w-full" variant="secondary">Go to dashboard</Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-white">Join group</h1>
            <p className="text-sm text-slate-400">
              You are invited to join <strong className="text-white">{invite.group_name}</strong>.
            </p>
            <form action={joinGroupFromInvite}>
              <input type="hidden" name="token" value={token} />
              <Button type="submit" className="w-full">Join Group</Button>
            </form>
          </>
        )}
      </Card>
    </main>
  );
}
