import { FadeUp } from "@/components/ui/fade-up";

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-pitch py-16">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-12 bg-accent" />
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.25em] font-semibold mb-1">Support The Club</p>
              <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider">BACK THE TEAM</h1>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-muted text-sm md:text-base mb-14 max-w-xl leading-relaxed">
            Your contribution helps us maintain facilities, purchase equipment, and provide opportunities for our athletes to excel.
          </p>
        </FadeUp>

        <FadeUp delay={0.18}>
          <div className="bg-crease border border-line p-4 md:p-8 flex justify-center">
            <iframe
              src="https://www.gofundme.com/f/support-college-cricket-at-ucr/widget/large"
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              className="rounded-none"
            />
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
