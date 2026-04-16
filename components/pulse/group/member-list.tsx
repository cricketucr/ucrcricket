"use client";

import { useEffect, useState } from "react";

import { removeMember, updateMemberRole } from "@pulse/app/actions/members";
import { Badge } from "@pulse/components/ui/badge";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";

type MemberListProps = {
  groupId: string;
  currentUserId: string;
  isAdmin: boolean;
  showKickControls?: boolean;
  members: Array<{
    user_id: string;
    role: "admin" | "member";
    profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
  }>;
};

export function MemberList({ groupId, currentUserId, isAdmin, showKickControls = true, members }: MemberListProps) {
  const [optimisticMembers, setOptimisticMembers] = useState(members);
  const optimisticAction = useOptimisticAction();

  useEffect(() => { setOptimisticMembers(members); }, [members]);

  const onRoleChange = (memberId: string, role: "admin" | "member") => {
    const previousMembers = optimisticMembers;
    optimisticAction.runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticMembers((current) =>
          current.map((member) => (member.user_id === memberId ? { ...member, role } : member)),
        );
        return previousMembers;
      },
      rollback: (state) => setOptimisticMembers(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("memberId", memberId);
        formData.set("role", role);
        await updateMemberRole(formData);
      },
      onErrorMessage: "Could not update member role. Reverted.",
    });
  };

  const onKick = (memberId: string) => {
    const previousMembers = optimisticMembers;
    optimisticAction.runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticMembers((current) => current.filter((member) => member.user_id !== memberId));
        return previousMembers;
      },
      rollback: (state) => setOptimisticMembers(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("memberId", memberId);
        await removeMember(formData);
      },
      onErrorMessage: "Could not remove member. Reverted.",
    });
  };

  return (
    <Card className="space-y-3">
      <h2 className="text-base font-semibold text-white">Members</h2>
      {optimisticAction.errorMessage ? (
        <p className="text-sm text-red-400">{optimisticAction.errorMessage}</p>
      ) : null}
      <div className="space-y-2">
        {optimisticMembers.map((member) => {
          const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
          return (
            <div
              key={member.user_id}
              className="flex flex-col gap-2 rounded-md border border-slate-800 p-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <p className="text-sm text-white">{profile?.name ?? "Unnamed user"}</p>
                <Badge variant={member.role === "admin" ? "success" : "default"}>{member.role}</Badge>
              </div>
              {isAdmin && showKickControls && member.user_id !== currentUserId ? (
                <div className="flex flex-wrap items-center gap-2">
                  {member.role === "member" ? (
                    <form onSubmit={(e) => { e.preventDefault(); onRoleChange(member.user_id, "admin"); }}>
                      <Button type="submit" variant="secondary">Make admin</Button>
                    </form>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); onRoleChange(member.user_id, "member"); }}>
                      <Button type="submit" variant="secondary">Make member</Button>
                    </form>
                  )}
                  <form onSubmit={(e) => { e.preventDefault(); onKick(member.user_id); }}>
                    <Button type="submit" variant="ghost">Kick</Button>
                  </form>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
