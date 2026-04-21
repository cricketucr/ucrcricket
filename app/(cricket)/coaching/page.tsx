import { FadeUp } from "@/components/ui/fade-up";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger";

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-pitch py-16">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1 h-12 bg-accent" />
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.25em] font-semibold mb-1">The Coaches</p>
              <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider">COACHING STAFF</h1>
            </div>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          {[
            { name: "Yash Patel", role: "Fast Bowler", spec: "Bowling & Strategy" },
            { name: "Arjun M", role: "Gymnast", spec: "Fitness & Agility" },
          ].map((coach, idx) => (
            <StaggerItem key={idx}>
              <div className="group bg-pitch hover:bg-crease transition-all duration-300 p-10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent group-hover:w-1 transition-all duration-300" />
                <div className="absolute top-6 right-6 font-display text-6xl text-line group-hover:text-boundary transition-colors duration-300 select-none leading-none">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-20 h-20 bg-boundary border border-line flex items-center justify-center text-3xl shrink-0 group-hover:border-accent/40 transition-all duration-300">
                    👤
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-1 group-hover:text-accent transition-colors duration-300">
                      {coach.name}
                    </h3>
                    <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold mb-4">{coach.role}</p>
                    <div className="border-l-2 border-line pl-4">
                      <p className="text-xs text-muted uppercase tracking-widest font-medium">Specialty</p>
                      <p className="text-white text-sm mt-1">{coach.spec}</p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
