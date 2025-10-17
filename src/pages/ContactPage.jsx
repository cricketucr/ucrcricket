import React from 'react';
import { Mail, Users } from 'lucide-react';

export const ContactPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Contact Us</h1>

      <div className="flex justify-center mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 pl-10 pr-20">
          <Mail className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Email</h3>
          <p className="text-slate-400">cricket@university.edu</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Send us a Message</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Name *</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Email *</label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Subject *</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="What is this regarding?"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Message *</label>
            <textarea
              rows="6"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="Your message..."
            />
          </div>

          <button className="w-full bg-amber-500 text-slate-900 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-all">
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
);
