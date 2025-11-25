import React from 'react';

export const RosterPage = () => {
  const allPlayers = [
    { name: 'Khrish Patel', role: 'Captain- Batsman / Wicket Keeper' },
    { name: 'Tarun Vadapalli', role: 'Vice Captain- All-Rounder' },
    { name: 'Abhi Tatavarty', role: 'Batsman' },
    { name: 'Siddharth Thatavarthy', role: 'All-Rounder' },
    { name: 'Ilhaan Abdullah', role: 'All-Rounder Batsman' },
    { name: 'Himanshu Rao', role: 'All Rounder Batsman' },
    { name: 'Muhammad Hassan', role: 'All Rounder Bowler' },
    { name: 'Shriyansh Annam', role: 'Bowler' },  
    { name: 'Dev Bhakta', role: 'Bowler' },
    { name: 'Yash Samineni', role: 'All Rounder' },
    { name: 'Khush Patel', role: 'Bowler' },
    { name: 'Kush Prajapati', role: 'Bowler' },
    { name: 'Sathvik Kumar', role: 'All-Rounder' },
    { name: 'Vishv Mepani', role: 'Batsman' },
    { name: 'Arslan Sheik', role: 'Bowler' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Team Roster</h1>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {allPlayers.map((player, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-8 md:p-10 text-center hover:border-amber-500 transition-all"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-6 mx-auto">
                  👤
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{player.name}</h3>
                <p className="text-amber-500 font-semibold text-sm md:text-base leading-relaxed">
                  {player.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
