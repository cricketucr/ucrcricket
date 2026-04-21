"use client";

import { useEffect, useState } from "react";

type TimedToastProps = {
  message: string;
  durationMs?: number;
  clearQueryParamOnHide?: string;
};

export function TimedToast({
  message,
  durationMs = 5000,
  clearQueryParamOnHide,
}: TimedToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progressWidth, setProgressWidth] = useState("100%");

  useEffect(() => {
    const progressTimer = setTimeout(() => setProgressWidth("0%"), 40);
    const fadeTimer = setTimeout(() => setIsFading(true), durationMs - 450);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      if (clearQueryParamOnHide && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete(clearQueryParamOnHide);
        const nextPath = `${url.pathname}${url.search}${url.hash}`;
        window.history.replaceState({}, "", nextPath);
      }
    }, durationMs);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [clearQueryParamOnHide, durationMs]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 w-[min(90vw,32rem)] -translate-x-1/2 border border-line bg-crease shadow-2xl shadow-black/50 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="w-0.5 h-full min-h-4 bg-accent shrink-0 mt-0.5" />
        <p className="text-sm text-white leading-relaxed">{message}</p>
      </div>
      <div className="h-0.5 w-full overflow-hidden bg-boundary">
        <div
          className="h-full bg-accent transition-[width] ease-linear"
          style={{ width: progressWidth, transitionDuration: `${durationMs}ms` }}
        />
      </div>
    </div>
  );
}
