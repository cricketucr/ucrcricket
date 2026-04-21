import { Instagram } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function CricketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-pitch">
      <Navigation />
      {children}
      <footer className="bg-crease border-t-2 border-line mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-3xl tracking-widest">
                <span className="text-accent">UCR</span>
                <span className="text-white"> CRICKET</span>
              </p>
              <p className="text-muted text-xs uppercase tracking-[0.2em] mt-1">Building champions on and off the field</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/ucrcricket/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 border border-line px-4 py-2 text-muted hover:border-accent hover:text-accent transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Instagram</span>
              </a>
            </div>
          </div>
          <div className="border-t border-line mt-8 pt-6">
            <p className="text-muted text-xs text-center tracking-widest uppercase">© 2025 UCR Cricket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
