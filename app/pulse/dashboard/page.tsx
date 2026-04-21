import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { getUserGroups } from "@pulse/lib/db/queries";
import { GroupLinkCard } from "@pulse/components/dashboard/group-link-card";
import { NewGroupModal } from "@pulse/components/dashboard/new-group-modal";
import { Card } from "@pulse/components/ui/card";
import { TimedToast } from "@pulse/components/ui/timed-toast";
import { TopNav } from "@pulse/components/top-nav";

type DashboardPageProps = {
  searchParams?: Promise<{ reason?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const memberships = await getUserGroups(user.id);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const showNotMemberMessage = resolvedSearchParams?.reason === "not-group-member";

  return (
    <>
      <TopNav name={profile.name} />
      {showNotMemberMessage ? (
        <TimedToast
          message="Access denied, you are not a member of that group. If you think this is a mistake, please contact a group admin."
          clearQueryParamOnHide="reason"
        />
      ) : null}
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
        <section className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-0.5 h-8 bg-accent" />
              <h1 className="font-display text-3xl tracking-wider text-white">YOUR GROUPS</h1>
            </div>
            <p className="text-xs text-muted uppercase tracking-widest pl-3.5">Create a group · invite people · run polls</p>
          </div>
          <NewGroupModal />
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {memberships.length === 0 ? (
            <Card className="sm:col-span-2">
              <p className="text-xs text-muted uppercase tracking-widest">No groups yet. Create one or ask an admin to share an invite link.</p>
            </Card>
          ) : null}
          {memberships.map((membership) => {
            const group = membership.group as { id: string; name: string } | null;
            if (!group) return null;
            return (
              <GroupLinkCard key={group.id} groupId={group.id} groupName={group.name} role={membership.role} />
            );
          })}
        </section>
      </main>
    </>
  );
}
