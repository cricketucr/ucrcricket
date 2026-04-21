"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const pages = ["home", "roster", "coaching", "timeline", "sponsor", "contact", "pulse"] as const;

function getHref(page: string) {
  return page === "home" ? "/" : `/${page}`;
}

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(page: string) {
    if (page === "home") return pathname === "/";
    if (page === "pulse") return pathname.startsWith("/pulse");
    return pathname === `/${page}`;
  }

  return (
    <nav className="bg-pitch border-b-2 border-accent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/ucrcricket.svg"
                alt="UCR Cricket"
                width={40}
                height={40}
                className="rounded-full w-9 h-9 md:w-10 md:h-10 transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-accent opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-display text-2xl text-accent tracking-widest">UCR</span>
              <span className="font-display text-2xl text-white tracking-widest"> CRICKET</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0">
            {pages.map((page) => (
              <Link
                key={page}
                href={getHref(page)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 ${
                  isActive(page)
                    ? "bg-accent text-pitch"
                    : "text-muted hover:text-white hover:bg-boundary"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-accent transition-colors p-1"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <Menu className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-3 pb-2 border-t border-line mt-3 space-y-0.5">
                {pages.map((page, i) => (
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={getHref(page)}
                      onClick={() => setIsOpen(false)}
                      className={`block font-display text-2xl tracking-widest px-4 py-2 transition-all duration-200 ${
                        isActive(page) ? "text-accent" : "text-muted hover:text-white"
                      }`}
                    >
                      {page.toUpperCase()}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
