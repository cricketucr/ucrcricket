import React from 'react';

export const SponsorPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          Support Our Team
        </h1>
        <p className="text-sm md:text-base text-slate-400 text-center mb-12 max-w-2xl mx-auto px-4">
          Your contribution helps us maintain facilities, purchase equipment, and provide
          opportunities for our athletes to excel
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-8 flex justify-center">
          <iframe
            src="https://www.gofundme.com/f/support-college-cricket-at-ucr/widget/large"
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
