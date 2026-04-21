import { FadeUp } from "@/components/ui/fade-up";

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-pitch py-16">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp>
          <div className="flex items-center gap-4 mb-20">
            <div className="w-1 h-12 bg-accent" />
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.25em] font-semibold mb-1">How it started</p>
              <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider">OUR JOURNEY</h1>
            </div>
          </div>
        </FadeUp>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-line" />

          <div className="space-y-0">
            {[
              { year: "2025", title: "Foundation", desc: "Cricket club established with 12 founding members" },
              { year: "2025", title: "Squad Formed", desc: "Assembled first official team roster with 15 players" },
              { year: "2026", title: "First Tournament", desc: "Participated in the Collegiate Cricket Tournament" },
            ].map((event, idx) => (
              <FadeUp key={idx} delay={idx * 0.15}>
                <div className="relative pl-20 md:pl-24 pb-16">
                  {/* Year circle */}
                  <div className="absolute left-0 w-12 h-12 md:w-16 md:h-16 bg-accent flex items-center justify-center shrink-0">
                    <span className="font-display text-pitch text-xs md:text-sm tracking-widest leading-none text-center">{event.year}</span>
                  </div>

                  {/* Connector line dot */}
                  <div className="absolute left-6 md:left-8 top-6 md:top-8 w-px h-full bg-line -translate-x-px" />

                  {/* Content card */}
                  <div className="group bg-crease border border-line hover:border-accent/30 transition-all duration-300 relative overflow-hidden ml-4">
                    <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent group-hover:w-0.5 transition-all duration-300" />
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-px bg-accent" />
                        <span className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">Milestone {idx + 1}</span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-3 group-hover:text-accent transition-colors duration-300">
                        {event.title}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed">{event.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
