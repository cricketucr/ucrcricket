import React from 'react';
import { DollarSign } from 'lucide-react';

export const SponsorPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Support Our Team</h1>
      <p className="text-sm md:text-base text-slate-400 text-center mb-12 max-w-2xl mx-auto px-4">
        Your contribution helps us maintain facilities, purchase equipment, and provide
        opportunities for our athletes to excel
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-amber-500 mb-6">Donation/Sponsorship Form</h2>

        <div className="flex justify-center overflow-x-auto">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScKkK4zDt7bi8SICJNdcnKaC4bjBKXDjrHPo6csPwQb388Rkw/viewform?embedded=true"
            width="100%"
            height="956"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="border-none rounded-lg max-w-full"
            style={{ minWidth: '320px' }}
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  </div>
);
