import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createEvent } from "@pulse/app/actions/events";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { getGroupMembership, getGroupWithMembers } from "@pulse/lib/db/queries";
import { getNextUpcomingEventId } from "@pulse/lib/events";
import { EventsList } from "@pulse/components/group/events-list";
import { EventForm } from "@pulse/components/group/event-form";
import { GroupRealtimeSync } from "@pulse/components/group/group-realtime-sync";
import { MemberList } from "@pulse/components/group/member-list";
import { TopNav } from "@pulse/components/top-nav";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Modal } from "@pulse/components/ui/modal";

type GroupPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupPage({ params }: GroupPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const { groupId } = await params;

  const membership = await getGroupMembership(groupId, user.id);
  if (!membership) redirect("/pulse/dashboard?reason=not-group-member");

  const groupData = await getGroupWithMembers(groupId);
  if (!groupData) notFound();

  const isAdmin = membership.role === "admin";
  const referenceTimeMs = groupData.referenceTimeMs;
  const nextUpcomingEventId = getNextUpcomingEventId(groupData.events, referenceTimeMs);

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      <GroupRealtimeSync groupId={groupId} eventIds={groupData.events.map((event) => event.id)} includeVotes />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">{groupData.group.name}</h1>
          </div>
          {isAdmin ? (
            <Link
              href={`/pulse/groups/${groupId}/settings`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Manage Group
            </Link>
          ) : (
            <Button variant="secondary" disabled>Member view</Button>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Events</h2>
            {isAdmin ? (
              <Modal title="Create event" triggerLabel="Create event">
                <EventForm groupId={groupId} action={createEvent} submitLabel="Create event" />
              </Modal>
            ) : null}
          </div>
          {groupData.events.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">
                No events yet. {isAdmin ? "Create one to start collecting votes." : ""}
              </p>
            </Card>
          ) : null}
          {groupData.events.length > 0 ? (
            <EventsList
              groupId={groupId}
              events={groupData.events}
              isAdmin={isAdmin}
              currentUserId={user.id}
              currentUserName={profile.name}
              nextUpcomingEventId={nextUpcomingEventId}
              referenceTimeMs={referenceTimeMs}
            />
          ) : null}
        </section>

        <section>
          <MemberList groupId={groupId} currentUserId={user.id} isAdmin={isAdmin} showKickControls={false} members={groupData.members} />
        </section>
      </main>
    </>
  );
}
