import React from 'react';
import { Users, Star, Clock } from 'lucide-react';
import reactLogo from '../assets/ucrcricket.svg';

export const HomePage = ({ onPageChange }) => (
  <div className="min-h-screen bg-slate-950">
    {/* Hero Section */}
    <div className="relative bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center mx-auto">
              <img
                src={reactLogo}
                alt="UCR Cricket"
                className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-transparent"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-amber-500">UCR</span> Cricket
          </h1>
          <p className="text-base md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto px-4">
            Building champions on and off the pitch through dedication, teamwork, and excellence
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <button
              onClick={() => onPageChange('roster')}
              className="bg-amber-500 text-slate-900 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-all"
            >
              Meet The Team
            </button>
            <button
              onClick={() => onPageChange('sponsor')}
              className="bg-slate-800 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all border border-slate-700"
            >
              Support Us
            </button>
          </div>
        </div>
      </div>
    </div>
    {/* Quick Stats */}
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {[
          //   { label: 'Championships', value: '12', icon: Users },
          { label: 'Active Players', value: '15', icon: Users },
          //   { label: 'Matches Won', value: '156', icon: Star },
          { label: 'Year(s) Active', value: '1', icon: Clock },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center"
          >
            <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
    {/* Leadership Highlight */}
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Leadership</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { name: 'Khrish Patel', role: 'Captain', img: '👤' },
          { name: 'Tarun Vadapalli', role: 'Vice Captain', img: '👤' },
          { name: 'Siddharth Thatavarthy', role: 'Secretary', img: '👤' },
          { name: 'Jia Panchal', role: 'Team Manager', img: '👤' },
          { name: 'Advaith Tontalapur', role: 'Developer/Photographer', img: '👤' },
          { name: 'Hiya Patel', role: 'Social Media Manager', img: '👤' },
          { name: 'YogaShikhar Marella', role: 'Editor', img: '👤' },
          
        ].map((leader, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-amber-500 transition-all"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              {leader.img}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">{leader.name}</h3>
            <p className="text-amber-500 font-medium text-sm md:text-base">{leader.role}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
