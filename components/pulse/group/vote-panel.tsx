"use client";

import { useEffect, useState } from "react";

import { castVoteOptimistic } from "@pulse/app/actions/votes";
import { Button } from "@pulse/components/ui/button";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";
import type { VoteValue } from "@pulse/lib/types";

type VoteRow = {
  user_id: string;
  vote: VoteValue;
  profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
};

type VotePanelProps = {
  groupId: string;
  eventId: string;
  isLocked: boolean;
  currentUserId: string;
  currentUserName: string;
  initialVotes: VoteRow[];
};

function getProfileFromVote(vote: VoteRow) {
  if (!vote.profiles) return null;
  return Array.isArray(vote.profiles) ? vote.profiles[0] ?? null : vote.profiles;
}

function getVoteSummary(votes: VoteRow[]) {
  const summary = { yes: [] as Array<{ id: string; name: string }>, no: [] as Array<{ id: string; name: string }>, maybe: [] as Array<{ id: string; name: string }> };
  for (const vote of votes) {
    const profile = getProfileFromVote(vote);
    if (profile) summary[vote.vote].push(profile);
  }
  return summary;
}

export function VotePanel({ groupId, eventId, isLocked, currentUserId, currentUserName, initialVotes }: VotePanelProps) {
  const [votes, setVotes] = useState<VoteRow[]>(initialVotes);
  const optimisticAction = useOptimisticAction();

  useEffect(() => { setVotes(initialVotes); }, [initialVotes]);

  const currentVote = votes.find((vote) => vote.user_id === currentUserId)?.vote;
  const voteSummary = getVoteSummary(votes);
  const voteButtons: Array<{ label: string; value: VoteValue }> = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Maybe", value: "maybe" },
  ];

  const onVoteClick = (selectedVote: VoteValue) => {
    if (isLocked || optimisticAction.isPending) return;

    const previousVotes = votes;
    const withoutCurrentUserVote = previousVotes.filter((vote) => vote.user_id !== currentUserId);
    const nextVote = currentVote === selectedVote ? null : selectedVote;
    const nextVotes = nextVote
      ? [...withoutCurrentUserVote, { user_id: currentUserId, vote: nextVote, profiles: { id: currentUserId, name: currentUserName } }]
      : withoutCurrentUserVote;

    optimisticAction.setErrorMessage(null);
    setVotes(nextVotes);

    optimisticAction.runOptimisticAction({
      applyOptimistic: () => previousVotes,
      rollback: (state) => { setVotes(state); },
      action: async () => { await castVoteOptimistic({ groupId, eventId, vote: selectedVote }); },
      onErrorMessage: "Could not save your vote. Reverted.",
    });
  };

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        {voteButtons.map((button) => (
          <Button
            key={button.value}
            type="button"
            variant={currentVote === button.value ? "primary" : "secondary"}
            className="w-full"
            disabled={isLocked || optimisticAction.isPending}
            onClick={() => onVoteClick(button.value)}
          >
            {button.label}
          </Button>
        ))}
      </div>
      {optimisticAction.errorMessage ? <p className="text-xs text-danger border-l-2 border-danger pl-3 py-1">{optimisticAction.errorMessage}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3 pt-1">
        {[
          { label: "Yes", votes: voteSummary.yes },
          { label: "No", votes: voteSummary.no },
          { label: "Maybe", votes: voteSummary.maybe },
        ].map(({ label, votes }) => (
          <div key={label} className="border-l-2 border-line pl-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">
              {label} <span className="text-accent">({votes.length})</span>
            </p>
            <p className="text-xs text-muted/70">{votes.map((p) => p.name).join(", ") || "—"}</p>
          </div>
        ))}
      </div>
    </>
  );
}
