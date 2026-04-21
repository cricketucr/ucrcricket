"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { signOut } from "@pulse/app/actions/auth";
import { Button } from "@pulse/components/ui/button";

type TopNavProps = {
  name: string;
  showDashboardButton?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
};

export function TopNav({
  name,
  showDashboardButton = false,
  pageTitle,
  pageSubtitle,
}: TopNavProps) {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/pulse/dashboard");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (profileMenuRef.current.contains(event.target as Node)) return;
      setIsProfileMenuOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="border-b-2 border-accent bg-pitch">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-3 items-center px-4 py-3">
        <div className="justify-self-start">
          {showDashboardButton ? (
            <Button
              variant="ghost"
              type="button"
              className="max-w-28 gap-1.5 sm:max-w-none text-muted hover:text-white"
              onClick={handleBack}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
                <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="block truncate whitespace-nowrap text-xs uppercase tracking-widest">Back</span>
            </Button>
          ) : null}
        </div>

        <Link
          href="/pulse/dashboard"
          className="justify-self-center font-display text-2xl tracking-widest text-accent transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          title="Go to dashboard"
        >
          PULSE
        </Link>

        <div className="relative justify-self-end" ref={profileMenuRef}>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-muted transition-all duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <span className="max-w-32 truncate">{name}</span>
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-3 w-3"
              animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M5 7.5L10 12.5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                role="menu"
                className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-40 border border-line bg-crease p-1 shadow-xl"
              >
                <form action={signOut}>
                  <button
                    type="submit"
                    role="menuitem"
                    className="w-full px-3 py-2 text-left text-xs uppercase tracking-widest text-muted transition-all duration-200 hover:bg-boundary hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Sign out
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {pageTitle ? (
        <div className="mx-auto w-full max-w-5xl px-4 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-0.5 bg-accent" />
              <h1 className="font-display text-3xl tracking-wider text-white">{pageTitle}</h1>
            </div>
            {pageSubtitle ? (
              <p className="pl-3.5 text-xs uppercase tracking-widest text-muted">{pageSubtitle}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
