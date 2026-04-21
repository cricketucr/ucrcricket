import Link from "next/link";
import { Settings } from "lucide-react";

import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { getUserGroups } from "@pulse/lib/db/queries";
import { GroupLinkCard } from "@pulse/components/dashboard/group-link-card";
import { NewGroupModal } from "@pulse/components/dashboard/new-group-modal";
import { Card } from "@pulse/components/ui/card";
import { TimedToast } from "@pulse/components/ui/timed-toast";

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
      {showNotMemberMessage ? (
        <TimedToast
          message="Access denied, you are not a member of that group. If you think this is a mistake, please contact a group admin."
          clearQueryParamOnHide="reason"
        />
      ) : null}
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
        <section className="flex flex-wrap items-end justify-between gap-3">
          <Link
            href="/pulse/settings"
            aria-label="Open settings"
            className="inline-flex h-10 w-10 items-center justify-center border border-line bg-crease text-muted transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Settings className="h-4 w-4" />
          </Link>
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
