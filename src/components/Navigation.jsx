import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import reactLogo from '../assets/ucrcricket.svg';

export const Navigation = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pages = ['home', 'roster', 'coaching', 'timeline', 'sponsor', 'contact'];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img src={reactLogo} alt="UCR Cricket" className="w-12 h-12 rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">UCR Cricket</h1>
              <p className="text-xs text-amber-500">Excellence in Sport</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-amber-500 text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => {
                  onPageChange(page);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-amber-500 text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
