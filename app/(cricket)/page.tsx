import Image from "next/image";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger";
import { AnimatedCounter } from "@/components/ui/count-up";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pitch">
      {/* Hero */}
      <div className="relative overflow-hidden bg-pitch">
        {/* Accent diagonal backdrop */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-accent/5 via-accent/2 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/40" />
        {/* Vertical accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-28">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-0">
            {/* Left: Text */}
            <div className="flex-1 lg:pr-12">
              <FadeUp delay={0.05}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-accent" />
                  <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em]">UC Riverside Cricket Team</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.12}>
                <h1 className="font-display leading-none mb-6">
                  <span className="block text-[5rem] md:text-[7rem] lg:text-[8.5rem] text-white">GRIND.</span>
                  <span className="block text-[5rem] md:text-[7rem] lg:text-[8.5rem] text-accent">HUSTLE.</span>
                  <span className="block text-[5rem] md:text-[7rem] lg:text-[8.5rem] text-white">WIN.</span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.22}>
                <p className="text-muted text-base md:text-lg mb-10 max-w-md leading-relaxed">
                  Building champions on and off the pitch through dedication, teamwork, and excellence.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/roster"
                    className="inline-block bg-accent text-pitch font-bold uppercase tracking-[0.15em] text-sm px-8 py-4 hover:bg-accent-dim transition-all duration-200 active:scale-[0.98]"
                  >
                    Meet The Squad
                  </Link>
                  <Link
                    href="/sponsor"
                    className="inline-block border border-line text-white font-semibold uppercase tracking-[0.15em] text-sm px-8 py-4 hover:border-accent hover:text-accent transition-all duration-200 active:scale-[0.98]"
                  >
                    Support Us
                  </Link>
                </div>
              </FadeUp>
            </div>

            {/* Right: Logo */}
            <FadeUp delay={0.15} className="shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-accent/10 scale-110 blur-2xl" />
                <div className="relative border-2 border-accent/30 rounded-full p-3">
                  <Image
                    src="/ucrcricket.svg"
                    alt="UCR Cricket"
                    width={200}
                    height={200}
                    className="rounded-full w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56"
                  />
                </div>
                {/* Rotating ring */}
                <div className="absolute inset-0 rounded-full border border-accent/20 scale-125" />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-line bg-crease">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 divide-x divide-line">
            {[
              { label: "Active Players", value: 15, icon: Users },
              { label: "Year(s) Active", value: 1, icon: Clock },
            ].map((stat, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <div className="py-10 px-6 md:px-12 text-center group">
                  <stat.icon className="w-5 h-5 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="font-display text-6xl md:text-7xl text-white mb-1">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-muted text-xs uppercase tracking-[0.2em] font-semibold">{stat.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <FadeUp>
          <div className="flex items-center gap-4 mb-14">
            <div className="w-1 h-10 bg-accent" />
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.25em] font-semibold mb-1">The People Behind It</p>
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider">LEADERSHIP</h2>
            </div>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-line">
          {[
            { name: "Khrish Patel", role: "Captain" },
            { name: "Tarun Vadapalli", role: "Vice Captain" },
            { name: "Siddharth Thatavarthy", role: "Secretary" },
            { name: "Jia Panchal", role: "Team Manager" },
            { name: "Advaith Tontalapur", role: "Developer / Photographer" },
            { name: "Hiya Patel", role: "Social Media Manager" },
            { name: "YogaShikhar Marella", role: "Editor" },
          ].map((leader, idx) => (
            <StaggerItem key={idx}>
              <div className="group bg-pitch p-8 hover:bg-crease transition-all duration-300 cursor-default relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent group-hover:w-1 transition-all duration-300" />
                <div className="w-16 h-16 bg-boundary border border-line flex items-center justify-center text-2xl mb-5 group-hover:border-accent/50 transition-all duration-300">
                  👤
                </div>
                <h3 className="font-display text-2xl text-white tracking-wide mb-1 group-hover:text-accent transition-colors duration-300">
                  {leader.name}
                </h3>
                <p className="text-muted text-xs uppercase tracking-[0.2em] font-semibold">{leader.role}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
