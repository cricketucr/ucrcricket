"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@pulse/components/ui/badge";

type GroupLinkCardProps = {
  groupId: string;
  groupName: string;
  role: string;
};

export function GroupLinkCard({ groupId, groupName, role }: GroupLinkCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/pulse/groups/${groupId}`}
        className="group block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="h-full border border-line bg-crease p-5 transition-all duration-300 hover:border-accent/40 hover:bg-boundary relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent group-hover:w-0.5 transition-all duration-300" />
          <p className="font-display text-xl tracking-wider text-white mb-3 group-hover:text-accent transition-colors duration-300">
            {groupName.toUpperCase()}
          </p>
          <Badge variant={role === "admin" ? "success" : "default"}>{role}</Badge>
        </div>
      </Link>
    </motion.div>
  );
}
