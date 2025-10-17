import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { RosterPage } from './pages/RosterPage';
import { CoachingPage } from './pages/CoachingPage';
import { TimelinePage } from './pages/TimelinePage';
import { SponsorPage } from './pages/SponsorPage';
import { ContactPage } from './pages/ContactPage';

const CricketWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const path = window.location.pathname;
    const page = path.replace('/', '') || 'home';
    setCurrentPage(page);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.history.pushState(null, '', `/${page}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const page = path.replace('/', '') || 'home';
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'roster':
        return <RosterPage />;
      case 'coaching':
        return <CoachingPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'sponsor':
        return <SponsorPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      {renderPage()}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <a
                href="https://www.instagram.com/ucrcricket/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full hover:bg-amber-500 text-slate-400 hover:text-slate-900 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="mb-2 text-slate-400">© 2025 UCR Cricket. All rights reserved.</p>
            <p className="text-sm text-slate-500">Building champions on and off the field</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CricketWebsite;
