import { Instagram } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function CricketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      {children}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <a
                href="https://www.instagram.com/ucrcricket/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full hover:bg-amber-500 text-slate-400 hover:text-slate-900 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="mb-2 text-slate-400">© 2025 UCR Cricket. All rights reserved.</p>
            <p className="text-sm text-slate-500">Building champions on and off the field</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
