import React from 'react';

export const StatsPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Team Statistics</h1>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-amber-500 mb-4">Top Run Scorers</h3>
          <div className="space-y-3">
            {[
              { name: 'James Mitchell', runs: 2340, pos: 1 },
              { name: 'Marcus Johnson', runs: 2100, pos: 2 },
              { name: 'David Chen', runs: 1890, pos: 3 },
              { name: 'Alex Kumar', runs: 1450, pos: 4 },
              { name: 'Sam Patel', runs: 1200, pos: 5 },
            ].map((player, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-amber-500 font-bold text-lg">{player.pos}</span>
                  <span className="text-white">{player.name}</span>
                </div>
                <span className="text-white font-semibold">{player.runs}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-amber-500 mb-4">Top Wicket Takers</h3>
          <div className="space-y-3">
            {[
              { name: 'Ryan Thompson', wickets: 78, pos: 1 },
              { name: 'Luke Williams', wickets: 70, pos: 2 },
              { name: 'Ahmed Hassan', wickets: 65, pos: 3 },
              { name: 'Alex Kumar', wickets: 45, pos: 4 },
              { name: 'Sam Patel', wickets: 38, pos: 5 },
            ].map((player, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-amber-500 font-bold text-lg">{player.pos}</span>
                  <span className="text-white">{player.name}</span>
                </div>
                <span className="text-white font-semibold">{player.wickets}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-amber-500 mb-4">Season Overview</h3>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Matches Played', value: '45' },
            { label: 'Matches Won', value: '32' },
            { label: 'Win Rate', value: '71%' },
            { label: 'Total Runs', value: '15,420' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
