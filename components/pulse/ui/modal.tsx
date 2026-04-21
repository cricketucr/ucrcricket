"use client";

import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@pulse/components/ui/button";
import { cn } from "@pulse/lib/utils";

type ModalProps = {
  title: string;
  triggerLabel: string;
  children: React.ReactNode;
  triggerClassName?: string;
};

type ModalControls = { closeModal: () => void };

const ModalContext = createContext<ModalControls | null>(null);

export function useModalControls() {
  return useContext(ModalContext);
}

export function Modal({ title, triggerLabel, children, triggerClassName }: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-pitch/80 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg border border-line bg-crease p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-5 bg-accent" />
                  <h3 className="font-display text-xl tracking-wider text-white">{title.toUpperCase()}</h3>
                </div>
                <button
                  className={cn(
                    "cursor-pointer p-1 text-muted transition-all duration-200 hover:text-accent active:scale-95",
                  )}
                  onClick={() => setOpen(false)}
                  type="button"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              <ModalContext.Provider value={{ closeModal: () => setOpen(false) }}>
                <div>{children}</div>
              </ModalContext.Provider>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
