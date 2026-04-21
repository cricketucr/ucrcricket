import { FadeUp } from "@/components/ui/fade-up";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-pitch py-16">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-12 bg-accent" />
            <div>
              <p className="text-accent text-xs uppercase tracking-[0.25em] font-semibold mb-1">Get In Touch</p>
              <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider">CONTACT US</h1>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-muted text-sm md:text-base mb-14 max-w-xl leading-relaxed">
            Have questions or want to get in touch with the UCR Cricket team? We&apos;d love to hear from you.
          </p>
        </FadeUp>

        <FadeUp delay={0.18}>
          <div className="bg-crease border border-line p-4 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-accent" />
              <h2 className="font-display text-2xl text-accent tracking-wider">CONTACT FORM</h2>
            </div>
            <div className="flex justify-center overflow-x-auto">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScI3QGPJUwG7ErDh9FS39pt1reJcRtawk4s3HLU7fT0Zd3vwg/viewform?embedded=true"
                width="100%"
                height="824"
                frameBorder="0"
                className="border-none rounded-none max-w-full"
                style={{ minWidth: "320px" }}
              />
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
