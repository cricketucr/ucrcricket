"use client";

import { useEffect, useState } from "react";

import { approveJoinRequest, denyJoinRequest } from "@pulse/app/actions/group-requests";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";

type JoinRequestsPanelProps = {
  groupId: string;
  requests: Array<{
    id: string;
    user_id: string;
    created_at: string;
    profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
  }>;
};

export function JoinRequestsPanel({ groupId, requests }: JoinRequestsPanelProps) {
  const [optimisticRequests, setOptimisticRequests] = useState(requests);
  const optimisticAction = useOptimisticAction();

  useEffect(() => {
    setOptimisticRequests(requests);
  }, [requests]);

  const onReviewRequest = (requestId: string, decision: "approve" | "deny") => {
    const previousRequests = optimisticRequests;
    optimisticAction.runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticRequests((current) => current.filter((request) => request.id !== requestId));
        return previousRequests;
      },
      rollback: (state) => setOptimisticRequests(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("requestId", requestId);
        if (decision === "approve") {
          await approveJoinRequest(formData);
          return;
        }
        await denyJoinRequest(formData);
      },
      onErrorMessage:
        decision === "approve"
          ? "Could not approve request. Reverted."
          : "Could not deny request. Reverted.",
    });
  };

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-white">Join requests</h2>
        <p className="text-sm text-slate-400">Review pending requests to access this group.</p>
      </div>
      {optimisticAction.errorMessage ? (
        <p className="text-sm text-red-400">{optimisticAction.errorMessage}</p>
      ) : null}

      <div className="space-y-2">
        {optimisticRequests.length === 0 ? (
          <p className="text-sm text-slate-500">No pending requests.</p>
        ) : null}
        {optimisticRequests.map((request) => {
          const profile = Array.isArray(request.profiles)
            ? request.profiles[0]
            : request.profiles;

          return (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-md border border-slate-800 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm text-white">{profile?.name ?? "Unnamed user"}</p>
                <p className="text-xs text-slate-500">
                  Requested {new Date(request.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    onReviewRequest(request.id, "deny");
                  }}
                >
                  <Button type="submit" variant="secondary" disabled={optimisticAction.isPending}>
                    Deny
                  </Button>
                </form>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    onReviewRequest(request.id, "approve");
                  }}
                >
                  <Button type="submit" disabled={optimisticAction.isPending}>
                    Approve
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
