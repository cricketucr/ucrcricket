"use client";

import { useEffect, useState } from "react";

import { createInvite, deleteInvite } from "@pulse/app/actions/invites";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";

type InvitePanelProps = {
  groupId: string;
  isAdmin: boolean;
  invites: Array<{ id: string; token: string; expires_at: string | null }>;
};

export function InvitePanel({ groupId, isAdmin, invites }: InvitePanelProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);
  const [optimisticInvites, setOptimisticInvites] = useState(invites);
  const { isPending, errorMessage, setErrorMessage, runOptimisticAction } = useOptimisticAction();

  useEffect(() => { setOptimisticInvites(invites); }, [invites]);

  const copyInviteLink = async (inviteId: string, inviteUrl: string) => {
    if (!navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedInviteId(inviteId);
      window.setTimeout(() => {
        setCopiedInviteId((current) => (current === inviteId ? null : current));
      }, 1500);
    } catch {
      setCopiedInviteId(null);
    }
  };

  const onCreateInvite = (formData: FormData) => {
    setErrorMessage(null);
    runOptimisticAction({
      applyOptimistic: () => null,
      rollback: () => {},
      action: async () => { await createInvite(formData); },
      onErrorMessage: "Could not create invite. Please try again.",
    });
  };

  const onInvalidateInvite = (inviteId: string) => {
    const previousInvites = optimisticInvites;
    runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticInvites((current) => current.filter((invite) => invite.id !== inviteId));
        return previousInvites;
      },
      rollback: (state) => setOptimisticInvites(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("inviteId", inviteId);
        await deleteInvite(formData);
      },
      onErrorMessage: "Could not invalidate invite. Reverted.",
    });
  };

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-white">Invite links</h2>
        <p className="text-sm text-slate-400">Share links so teammates can join this group.</p>
      </div>

      {isAdmin ? (
        <form action={onCreateInvite} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <input type="hidden" name="groupId" value={groupId} />
          <div className="w-full sm:max-w-32">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400" htmlFor="expiresInOption">
              Expires in
            </label>
            <select
              id="expiresInOption"
              name="expiresInOption"
              defaultValue="7d"
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-700"
            >
              <option value="1d">1 day</option>
              <option value="3d">3 days</option>
              <option value="7d">7 days</option>
              <option value="14d">14 days</option>
              <option value="30d">30 days</option>
              <option value="never">Never</option>
            </select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create invite"}
          </Button>
        </form>
      ) : null}
      {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

      <div className="space-y-2">
        {optimisticInvites.length === 0 ? (
          <p className="text-sm text-slate-500">No active invites.</p>
        ) : null}
        {optimisticInvites.map((invite) => {
          const inviteUrl = appUrl
            ? `${appUrl}/pulse/invite/${invite.token}`
            : `/pulse/invite/${invite.token}`;

          return (
            <div key={invite.id} className="space-y-2 rounded-md border border-slate-800 p-3 text-sm">
              <div className="flex items-stretch rounded-md border border-slate-700 bg-slate-800 text-slate-300">
                <p className="min-w-0 flex-1 break-all px-3 py-2">{inviteUrl}</p>
                <div className="border-l border-slate-700" />
                <button
                  type="button"
                  onClick={() => copyInviteLink(invite.id, inviteUrl)}
                  className="cursor-pointer px-3 transition hover:bg-slate-700"
                  title="Copy invite link"
                  aria-label="Copy invite link"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              {copiedInviteId === invite.id ? <p className="text-xs text-emerald-400">Copied to clipboard</p> : null}
              <div className="flex items-center justify-between gap-3">
                <p className="text-slate-500">
                  {invite.expires_at ? `Expires ${new Date(invite.expires_at).toLocaleString()}` : "Never expires"}
                </p>
                {isAdmin ? (
                  <form onSubmit={(e) => { e.preventDefault(); onInvalidateInvite(invite.id); }}>
                    <Button type="submit" variant="secondary" disabled={isPending}>Invalidate</Button>
                  </form>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
