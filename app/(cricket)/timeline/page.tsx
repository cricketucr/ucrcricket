export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Our Journey</h1>
        <div className="relative">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-slate-800" />
          <div className="space-y-8 md:space-y-12">
            {[
              { year: "2025", title: "Foundation", desc: "Cricket club established with 12 founding members" },
              { year: "2025", title: "Squad Formed", desc: "Assembled first official team roster with 15 players" },
            ].map((event, idx) => (
              <div key={idx} className="relative pl-16 md:pl-20">
                <div className="absolute left-0 w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-900 font-bold text-xs md:text-base">{event.year}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
