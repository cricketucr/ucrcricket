"use client";

import Link from "next/link";

import { Badge } from "@pulse/components/ui/badge";
import { Card } from "@pulse/components/ui/card";

type GroupLinkCardProps = {
  groupId: string;
  groupName: string;
  role: string;
};

export function GroupLinkCard({ groupId, groupName, role }: GroupLinkCardProps) {
  return (
    <Link
      href={`/pulse/groups/${groupId}`}
      className="block rounded-md text-left transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <Card className="h-full space-y-2 transition hover:border-slate-700">
        <p className="text-base font-semibold text-white">{groupName}</p>
        <Badge variant={role === "admin" ? "success" : "default"}>{role}</Badge>
      </Card>
    </Link>
  );
}
