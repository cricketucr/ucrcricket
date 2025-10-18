import React from 'react';
import { Mail, Users } from 'lucide-react';

export const ContactPage = () => (
  <div className="min-h-screen bg-slate-950 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">Contact Us</h1>
      <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
        Have questions or want to get in touch with the UCR Cricket team? We'd love to hear from
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Donation/Sponsorship Form</h2>

        <div className="flex justify-center overflow-auto">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScI3QGPJUwG7ErDh9FS39pt1reJcRtawk4s3HLU7fT0Zd3vwg/viewform?embedded=true"
            width="640"
            height="824"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  </div>
);
