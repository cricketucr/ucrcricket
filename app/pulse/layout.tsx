import { Navigation } from "@/components/navigation";

export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navigation />
      {children}
    </div>
  );
}
