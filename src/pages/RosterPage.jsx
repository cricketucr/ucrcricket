import React from 'react';

export const RosterPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Team Roster</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Batsmen</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: 'James Mitchell', matches: 45, runs: 2340, avg: '52.00' },
            { name: 'David Chen', matches: 38, runs: 1890, avg: '49.74' },
            { name: 'Marcus Johnson', matches: 42, runs: 2100, avg: '50.00' },
          ].map((player, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">
                👤
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Matches:</span>
                  <span className="text-white">{player.matches}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Runs:</span>
                  <span className="text-white">{player.runs}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Average:</span>
                  <span className="text-amber-500 font-semibold">{player.avg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Bowlers</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: 'Ryan Thompson', matches: 40, wickets: 78, avg: '18.50' },
            { name: 'Ahmed Hassan', matches: 35, wickets: 65, avg: '20.30' },
            { name: 'Luke Williams', matches: 38, wickets: 70, avg: '19.80' },
          ].map((player, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">
                👤
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Matches:</span>
                  <span className="text-white">{player.matches}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wickets:</span>
                  <span className="text-white">{player.wickets}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Average:</span>
                  <span className="text-amber-500 font-semibold">{player.avg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-amber-500 mb-6">All-Rounders</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: 'Alex Kumar', matches: 43, runs: 1450, wickets: 45 },
            { name: 'Sam Patel', matches: 36, runs: 1200, wickets: 38 },
          ].map((player, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">
                👤
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Matches:</span>
                  <span className="text-white">{player.matches}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Runs:</span>
                  <span className="text-white">{player.runs}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wickets:</span>
                  <span className="text-amber-500 font-semibold">{player.wickets}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
