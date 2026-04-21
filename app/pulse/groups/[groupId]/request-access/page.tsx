import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requestToJoinGroup } from "@pulse/app/actions/group-requests";
import { TopNav } from "@pulse/components/top-nav";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { getGroupMembership } from "@pulse/lib/db/queries";
import { createClient } from "@pulse/lib/supabase/server";

type GroupRequestAccessPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupRequestAccessPage({ params }: GroupRequestAccessPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const { groupId } = await params;
  const membership = await getGroupMembership(groupId, user.id);

  if (membership) {
    redirect(`/pulse/groups/${groupId}`);
  }

  const supabase = await createClient();
  const { data: group } = await supabase
    .from("groups")
    .select("id, name")
    .eq("id", groupId)
    .maybeSingle<{ id: string; name: string }>();

  if (!group) {
    notFound();
  }

  const { data: pendingRequest } = await supabase
    .from("group_join_requests")
    .select("id, created_at")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle<{ id: string; created_at: string }>();

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      <main className="mx-auto w-full max-w-2xl px-4 py-6">
        <Card className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-white">Request access</h1>
            <p className="text-sm text-slate-400">
              You are not currently a member of{" "}
              <strong className="text-white">{group.name}</strong>.
            </p>
          </div>

          {pendingRequest ? (
            <div className="space-y-3">
              <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                Request submitted on {new Date(pendingRequest.created_at).toLocaleString()}.
                An admin will review it soon.
              </p>
              <Link href="/pulse/dashboard">
                <Button variant="secondary">Back to dashboard</Button>
              </Link>
            </div>
          ) : (
            <form action={requestToJoinGroup} className="space-y-3">
              <input type="hidden" name="groupId" value={groupId} />
              <Button type="submit">Request to join group</Button>
              <p className="text-xs text-slate-500">
                Admins can accept or deny your request from group settings.
              </p>
            </form>
          )}
        </Card>
      </main>
    </>
  );
}
