"use client";

import { useState } from "react";

type OptimisticActionOptions<TState> = {
  applyOptimistic: () => TState;
  rollback: (previousState: TState) => void;
  action: () => Promise<void>;
  onSuccess?: () => void;
  onErrorMessage?: string;
};

export function useOptimisticAction() {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runOptimisticAction = <TState,>({
    applyOptimistic,
    rollback,
    action,
    onSuccess,
    onErrorMessage = "Could not save changes.",
  }: OptimisticActionOptions<TState>) => {
    if (isPending) {
      return;
    }

    const previousState = applyOptimistic();
    setErrorMessage(null);
    setIsPending(true);

    void (async () => {
      try {
        await action();
        onSuccess?.();
      } catch {
        rollback(previousState);
        setErrorMessage(onErrorMessage);
      } finally {
        setIsPending(false);
      }
    })();
  };

  return { isPending, errorMessage, setErrorMessage, runOptimisticAction };
}
