export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Coaching Staff</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Yash Patel", role: "Fast Bowler", spec: "Bowling & Strategy" },
            { name: "Arjun M", role: "Gymnast", spec: "Fitness & Agility" },
          ].map((coach, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{coach.name}</h3>
                  <p className="text-amber-500 font-semibold mb-3 text-sm md:text-base">{coach.role}</p>
                  <div className="text-sm text-slate-400">
                    <span className="font-medium">Specialty:</span> {coach.spec}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
