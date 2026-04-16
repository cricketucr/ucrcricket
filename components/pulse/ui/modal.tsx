"use client";

import { createContext, useContext, useState } from "react";

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
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <button
                className={cn(
                  "cursor-pointer rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95 active:bg-slate-700",
                )}
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Close modal"
              >
                X
              </button>
            </div>
            <ModalContext.Provider value={{ closeModal: () => setOpen(false) }}>
              <div>{children}</div>
            </ModalContext.Provider>
          </div>
        </div>
      ) : null}
    </>
  );
}
