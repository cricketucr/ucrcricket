"use client";

import { useFormStatus } from "react-dom";

import { createGroup } from "@pulse/app/actions/groups";
import { Button } from "@pulse/components/ui/button";
import { Input } from "@pulse/components/ui/input";
import { Modal } from "@pulse/components/ui/modal";

function CreateGroupSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}

export function NewGroupModal() {
  return (
    <Modal title="New group" triggerLabel="New Group">
      <form action={createGroup} className="space-y-3">
        <div>
          <label htmlFor="new-group-name" className="mb-1 block text-sm font-medium text-slate-300">
            Group name
          </label>
          <Input
            id="new-group-name"
            name="name"
            placeholder="e.g. Weekend team"
            maxLength={120}
            required
          />
        </div>
        <CreateGroupSubmitButton />
      </form>
    </Modal>
  );
}
