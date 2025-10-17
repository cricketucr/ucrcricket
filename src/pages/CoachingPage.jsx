import React from 'react';

export const CoachingPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Coaching Staff</h1>

      <div className="grid grid-cols-2 gap-6">
        {[
          {
            name: 'Michael Roberts',
            role: 'Head Coach',
            exp: '15 years',
            spec: 'Batting & Strategy',
          },
          {
            name: 'Sarah Anderson',
            role: 'Assistant Coach',
            exp: '8 years',
            spec: 'Bowling & Fielding',
          },
          {
            name: 'Tom Bradley',
            role: 'Fitness Trainer',
            exp: '10 years',
            spec: 'Strength & Conditioning',
          },
          {
            name: 'Dr. Emma Wilson',
            role: 'Sports Psychologist',
            exp: '12 years',
            spec: 'Mental Performance',
          },
        ].map((coach, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                👤
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{coach.name}</h3>
                <p className="text-amber-500 font-semibold mb-3">{coach.role}</p>
                <div className="space-y-1 text-sm">
                  <div className="text-slate-400">
                    <span className="font-medium">Experience:</span> {coach.exp}
                  </div>
                  <div className="text-slate-400">
                    <span className="font-medium">Specialty:</span> {coach.spec}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
