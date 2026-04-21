import { StaggerContainer, StaggerItem } from "@/components/ui/stagger";
import { FadeUp } from "@/components/ui/fade-up";

export default function RosterPage() {
  const allPlayers = [
    { name: "Khrish Patel", role: "Captain", spec: "Batsman / Wicket Keeper" },
    { name: "Tarun Vadapalli", role: "Vice Captain", spec: "All-Rounder" },
    { name: "Abhi Tatavarty", role: "Batsman", spec: null },
    { name: "Siddharth Thatavarthy", role: "All-Rounder", spec: null },
    { name: "Ilhaan Abdullah", role: "All-Rounder", spec: "Batsman" },
    { name: "Himanshu Rao", role: "All Rounder", spec: "Batsman" },
    { name: "Muhammad Hassan", role: "All Rounder", spec: "Bowler" },
    { name: "Shriyansh Annam", role: "Bowler", spec: null },
    { name: "Dev Bhakta", role: "Bowler", spec: null },
    { name: "Yash Samineni", role: "All Rounder", spec: null },
    { name: "Khush Patel", role: "Bowler", spec: null },
    { name: "Kush Prajapati", role: "Bowler", spec: null },
    { name: "Sathvik Kumar", role: "All-Rounder", spec: null },
    { name: "Vishv Mepani", role: "Batsman", spec: null },
    { name: "Arslan Sheik", role: "Bowler", spec: null },
    { name: "Aditya Saptarshi", role: "Bowler", spec: null },
  ];

  return (
    <div className="min-h-screen bg-pitch py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1 h-12 bg-accent" />
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.25em] font-semibold mb-1">Season 2025</p>
              <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider">TEAM ROSTER</h1>
            </div>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
          {allPlayers.map((player, idx) => (
            <StaggerItem key={idx}>
              <div className="group bg-pitch hover:bg-crease transition-all duration-300 relative overflow-hidden">
                {/* Number badge */}
                <div className="absolute top-4 right-4 font-display text-4xl text-line group-hover:text-boundary transition-colors duration-300 select-none leading-none">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                {/* Accent left border on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent group-hover:w-1 transition-all duration-300" />

                <div className="p-8 md:p-10">
                  <div className="w-16 h-16 bg-boundary border border-line flex items-center justify-center text-2xl mb-6 group-hover:border-accent/40 transition-all duration-300">
                    👤
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-1 group-hover:text-accent transition-colors duration-300">
                    {player.name}
                  </h3>
                  <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold mb-1">{player.role}</p>
                  {player.spec && (
                    <p className="text-muted text-xs uppercase tracking-widest">{player.spec}</p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
