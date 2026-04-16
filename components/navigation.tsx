"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const pages = ["home", "roster", "coaching", "timeline", "sponsor", "contact"] as const;

function getHref(page: string) {
  return page === "home" ? "/" : `/${page}`;
}

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(page: string) {
    if (page === "home") return pathname === "/";
    return pathname === `/${page}`;
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/ucrcricket.svg"
              alt="UCR Cricket"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">UCR Cricket</h1>
              <p className="text-xs text-amber-500">Excellence in Sport</p>
            </div>
          </Link>

          <div className="hidden md:flex space-x-1">
            {pages.map((page) => (
              <Link
                key={page}
                href={getHref(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(page)
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {pages.map((page) => (
              <Link
                key={page}
                href={getHref(page)}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(page)
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
