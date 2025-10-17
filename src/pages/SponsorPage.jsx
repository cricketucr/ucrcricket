import React from 'react';
import { DollarSign } from 'lucide-react';

export const SponsorPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">Support Our Team</h1>
      <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
        Your contribution helps us maintain facilities, purchase equipment, and provide
        opportunities for our athletes to excel
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Donation/Sponsorship Form</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Full Name *</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Email *</label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Organization (if applicable)
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="Company Name"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Sponsorship Tier *</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500">
              <option>Bronze - $500</option>
              <option>Silver - $1,000</option>
              <option>Gold - $2,500</option>
              <option>Platinum - $5,000</option>
              <option>Custom Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Message (Optional)</label>
            <textarea
              rows="4"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="Tell us about your interest in supporting our team..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4" />
            <label className="text-slate-400 text-sm">
              I would like to receive updates about the team
            </label>
          </div>

          <button className="w-full bg-amber-500 text-slate-900 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-all flex items-center justify-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Submit Sponsorship Form</span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-4 gap-4">
        {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center"
          >
            <div className="text-amber-500 font-bold mb-1">{tier}</div>
            <div className="text-slate-400 text-sm">Sponsor</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
