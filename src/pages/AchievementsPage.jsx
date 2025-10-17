import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';

export const AchievementsPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Previous Wins & Achievements</h1>

      <div className="space-y-6">
        {[
          {
            year: '2024',
            title: 'State Championship',
            desc: 'Won by 45 runs against City University',
          },
          {
            year: '2023',
            title: 'Inter-College Trophy',
            desc: 'Defeated rivals in thrilling final',
          },
          {
            year: '2023',
            title: 'Spring Tournament Champions',
            desc: 'Undefeated throughout the tournament',
          },
          {
            year: '2022',
            title: 'Regional Cup Winners',
            desc: 'Beat 12 teams to claim the title',
          },
          {
            year: '2022',
            title: 'Best Team Award',
            desc: 'Recognized for sportsmanship and excellence',
          },
          { year: '2021', title: 'Division Champions', desc: 'Perfect season with 15-0 record' },
        ].map((achievement, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-6 hover:border-amber-500 transition-all"
          >
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-10 h-10 text-slate-900" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-amber-500 font-bold text-lg">{achievement.year}</span>
                <ChevronRight className="w-5 h-5 text-slate-600" />
                <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
              </div>
              <p className="text-slate-400">{achievement.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
