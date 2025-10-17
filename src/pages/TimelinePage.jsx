import React from 'react';

export const TimelinePage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">Our Journey</h1>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800"></div>

        <div className="space-y-12">
          {[
            {
              year: '2025',
              title: 'Foundation',
              desc: 'Cricket club established with 12 founding members',
            },
            {
              year: '2025',
              title: 'Squad Formed',
              desc: 'Assembled first official team roster with 15 players',
            },
            // {
            //   year: '2010',
            //   title: 'New Facilities',
            //   desc: 'State-of-the-art cricket ground inaugurated',
            // },
            // {
            //   year: '2015',
            //   title: 'National Recognition',
            //   desc: 'Ranked among top 10 UCR cricket teams nationwide',
            // },
            // {
            //   year: '2020',
            //   title: 'Record Season',
            //   desc: 'Achieved historic 20-match winning streak',
            // },
            // {
            //   year: '2025',
            //   title: 'Today',
            //   desc: 'Continuing the legacy of excellence with 28 active players',
            // },
          ].map((event, idx) => (
            <div key={idx} className="relative pl-20">
              <div className="absolute left-0 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold">{event.year}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-slate-400">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
