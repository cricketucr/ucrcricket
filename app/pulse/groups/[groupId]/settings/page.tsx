import { notFound, redirect } from "next/navigation";

import { getGroupMembership, getGroupWithMembers } from "@pulse/lib/db/queries";
import { GroupRealtimeSync } from "@pulse/components/group/group-realtime-sync";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { DeleteGroupForm } from "@pulse/components/group/delete-group-form";
import { InvitePanel } from "@pulse/components/group/invite-panel";
import { JoinRequestsPanel } from "@pulse/components/group/join-requests-panel";
import { MemberList } from "@pulse/components/group/member-list";
import { TopNav } from "@pulse/components/top-nav";
import { Card } from "@pulse/components/ui/card";

type GroupSettingsPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupSettingsPage({ params }: GroupSettingsPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const { groupId } = await params;

  const membership = await getGroupMembership(groupId, user.id);
  if (!membership) redirect(`/pulse/groups/${groupId}/request-access`);
  if (membership.role !== "admin") redirect(`/pulse/groups/${groupId}`);

  const groupData = await getGroupWithMembers(groupId);
  if (!groupData) notFound();

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      <GroupRealtimeSync groupId={groupId} includeInvites />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Manage Group</h1>
            <p className="text-sm text-slate-400">{groupData.group.name}</p>
          </div>
        </section>

        <Card>
          <p className="text-sm text-slate-400">Group settings let admins manage invite links and member access.</p>
        </Card>

        <section className="grid gap-3 lg:grid-cols-2">
          <InvitePanel groupId={groupId} isAdmin invites={groupData.invites} />
          <JoinRequestsPanel groupId={groupId} requests={groupData.joinRequests} />
          <MemberList groupId={groupId} currentUserId={user.id} isAdmin members={groupData.members} />
        </section>

        <Card className="border-red-900/50 bg-red-950/30">
          <h2 className="text-base font-semibold text-red-400">Delete group</h2>
          <p className="mt-1 text-sm text-red-400/80">
            Permanently remove this group, all events, votes, invites, and member records. This cannot be undone.
          </p>
          <div className="mt-4">
            <DeleteGroupForm groupId={groupId} />
          </div>
        </Card>
      </main>
    </>
  );
}
