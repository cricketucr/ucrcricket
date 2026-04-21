import { Navigation } from "@/components/navigation";
import { PageTransition } from "@/components/ui/page-transition";

export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-pitch">
      <Navigation />
      <PageTransition>
        {children}
      </PageTransition>
    </div>
  );
}
