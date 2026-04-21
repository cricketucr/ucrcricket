export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-pitch">
      {children}
    </div>
  );
}
