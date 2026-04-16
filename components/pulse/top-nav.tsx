"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { signOut } from "@pulse/app/actions/auth";
import { Button } from "@pulse/components/ui/button";

type TopNavProps = {
  name: string;
  showDashboardButton?: boolean;
};

export function TopNav({ name, showDashboardButton = false }: TopNavProps) {
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
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-3 items-center px-4 py-3">
        <div className="justify-self-start">
          {showDashboardButton ? (
            <Button
              variant="secondary"
              type="button"
              className="max-w-28 gap-1 sm:max-w-none"
              onClick={handleBack}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
                <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="block truncate whitespace-nowrap">Back</span>
            </Button>
          ) : null}
        </div>

        <Link
          href="/pulse/dashboard"
          className="justify-self-center rounded-md px-2 py-1 text-sm font-semibold text-amber-500 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Go to dashboard"
        >
          Pulse
        </Link>

        <div className="relative justify-self-end" ref={profileMenuRef}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <span className="max-w-32 truncate">{name}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
            >
              <path d="M5 7.5L10 12.5l5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isProfileMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-40 rounded-md border border-slate-800 bg-slate-900 p-1 shadow-lg"
            >
              <Link
                href="/pulse/settings"
                role="menuitem"
                className="block rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Settings
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  role="menuitem"
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
