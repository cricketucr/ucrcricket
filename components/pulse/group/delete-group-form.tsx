"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteGroup } from "@pulse/app/actions/groups";
import { Button } from "@pulse/components/ui/button";
import { Input } from "@pulse/components/ui/input";

type DeleteGroupFormProps = { groupId: string };

export function DeleteGroupForm({ groupId }: DeleteGroupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deleteGroup(formData);
        router.push("/pulse/dashboard");
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not delete group.";
        setErrorMessage(message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <input type="hidden" name="groupId" value={groupId} />
      <label className="block text-sm font-medium text-slate-300" htmlFor="delete-confirm">
        Type <span className="font-mono text-white">DELETE</span> to confirm
      </label>
      <Input id="delete-confirm" name="confirm" autoComplete="off" placeholder="DELETE" disabled={isPending} />
      {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
      <Button type="submit" variant="danger" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Deleting…" : "Delete group"}
      </Button>
    </form>
  );
}
