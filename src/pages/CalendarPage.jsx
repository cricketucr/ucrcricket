import React from 'react';
import { Calendar } from 'lucide-react';

export const CalendarPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Match Calendar</h1>

      <div className="space-y-6">
        {[
          {
            date: 'Oct 18, 2025',
            opponent: 'State University',
            venue: 'Home Ground',
            time: '2:00 PM',
          },
          { date: 'Oct 25, 2025', opponent: 'City College', venue: 'Away', time: '3:00 PM' },
          {
            date: 'Nov 2, 2025',
            opponent: 'Tech Institute',
            venue: 'Home Ground',
            time: '1:00 PM',
          },
          {
            date: 'Nov 9, 2025',
            opponent: 'Metro University',
            venue: 'Neutral',
            time: '2:30 PM',
          },
          { date: 'Nov 16, 2025', opponent: 'Regional Finals', venue: 'TBD', time: 'TBD' },
        ].map((match, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm">{match.date}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">vs {match.opponent}</h3>
                  <p className="text-slate-400">
                    {match.venue} • {match.time}
                  </p>
                </div>
              </div>
              <button className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
