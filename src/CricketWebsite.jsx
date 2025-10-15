import React, { useState } from 'react';
import { Calendar, Trophy, Users, Mail, DollarSign, Clock, Star, ChevronRight } from 'lucide-react';

const CricketWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">College Cricket</h1>
              <p className="text-xs text-amber-500">Excellence in Sport</p>
            </div>
          </div>
          <div className="flex space-x-1">
            {['home', 'roster', 'stats', 'achievements', 'calendar', 'coaching', 'timeline', 'sponsor', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
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
        </div>
      </div>
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-16 h-16 text-slate-900" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">
              University <span className="text-amber-500">Cricket Club</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Building champions on and off the field through dedication, teamwork, and excellence
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setCurrentPage('roster')} className="bg-amber-500 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-all">
                Meet The Team
              </button>
              <button onClick={() => setCurrentPage('sponsor')} className="bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all border border-slate-700">
                Support Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Championships', value: '12', icon: Trophy },
            { label: 'Active Players', value: '28', icon: Users },
            { label: 'Matches Won', value: '156', icon: Star },
            { label: 'Years Active', value: '25', icon: Clock }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
              <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Highlight */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Leadership</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: 'James Mitchell', role: 'Captain', img: '👤' },
            { name: 'Ryan Thompson', role: 'Vice Captain', img: '👤' },
            { name: 'Alex Kumar', role: 'Team Manager', img: '👤' }
          ].map((leader, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-amber-500 transition-all">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {leader.img}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
              <p className="text-amber-500 font-medium">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Roster Page
  const RosterPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Team Roster</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Batsmen</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'James Mitchell', matches: 45, runs: 2340, avg: '52.00' },
              { name: 'David Chen', matches: 38, runs: 1890, avg: '49.74' },
              { name: 'Marcus Johnson', matches: 42, runs: 2100, avg: '50.00' }
            ].map((player, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">
                  👤
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Matches:</span>
                    <span className="text-white">{player.matches}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Runs:</span>
                    <span className="text-white">{player.runs}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Average:</span>
                    <span className="text-amber-500 font-semibold">{player.avg}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Bowlers</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'Ryan Thompson', matches: 40, wickets: 78, avg: '18.50' },
              { name: 'Ahmed Hassan', matches: 35, wickets: 65, avg: '20.30' },
              { name: 'Luke Williams', matches: 38, wickets: 70, avg: '19.80' }
            ].map((player, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">
                  👤
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Matches:</span>
                    <span className="text-white">{player.matches}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Wickets:</span>
                    <span className="text-white">{player.wickets}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Average:</span>
                    <span className="text-amber-500 font-semibold">{player.avg}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">All-Rounders</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'Alex Kumar', matches: 43, runs: 1450, wickets: 45 },
              { name: 'Sam Patel', matches: 36, runs: 1200, wickets: 38 }
            ].map((player, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">
                  👤
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Matches:</span>
                    <span className="text-white">{player.matches}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Runs:</span>
                    <span className="text-white">{player.runs}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Wickets:</span>
                    <span className="text-amber-500 font-semibold">{player.wickets}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Stats Page
  const StatsPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Team Statistics</h1>
        
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-500 mb-4">Top Run Scorers</h3>
            <div className="space-y-3">
              {[
                { name: 'James Mitchell', runs: 2340, pos: 1 },
                { name: 'Marcus Johnson', runs: 2100, pos: 2 },
                { name: 'David Chen', runs: 1890, pos: 3 },
                { name: 'Alex Kumar', runs: 1450, pos: 4 },
                { name: 'Sam Patel', runs: 1200, pos: 5 }
              ].map((player, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-500 font-bold text-lg">{player.pos}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                  <span className="text-white font-semibold">{player.runs}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-500 mb-4">Top Wicket Takers</h3>
            <div className="space-y-3">
              {[
                { name: 'Ryan Thompson', wickets: 78, pos: 1 },
                { name: 'Luke Williams', wickets: 70, pos: 2 },
                { name: 'Ahmed Hassan', wickets: 65, pos: 3 },
                { name: 'Alex Kumar', wickets: 45, pos: 4 },
                { name: 'Sam Patel', wickets: 38, pos: 5 }
              ].map((player, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-500 font-bold text-lg">{player.pos}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                  <span className="text-white font-semibold">{player.wickets}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-amber-500 mb-4">Season Overview</h3>
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Matches Played', value: '45' },
              { label: 'Matches Won', value: '32' },
              { label: 'Win Rate', value: '71%' },
              { label: 'Total Runs', value: '15,420' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Achievements Page
  const AchievementsPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Previous Wins & Achievements</h1>
        
        <div className="space-y-6">
          {[
            { year: '2024', title: 'State Championship', desc: 'Won by 45 runs against City University' },
            { year: '2023', title: 'Inter-College Trophy', desc: 'Defeated rivals in thrilling final' },
            { year: '2023', title: 'Spring Tournament Champions', desc: 'Undefeated throughout the tournament' },
            { year: '2022', title: 'Regional Cup Winners', desc: 'Beat 12 teams to claim the title' },
            { year: '2022', title: 'Best Team Award', desc: 'Recognized for sportsmanship and excellence' },
            { year: '2021', title: 'Division Champions', desc: 'Perfect season with 15-0 record' }
          ].map((achievement, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-6 hover:border-amber-500 transition-all">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-10 h-10 text-slate-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-amber-500 font-bold text-lg">{achievement.year}</span>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                  <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                </div>
                <p className="text-slate-400">{achievement.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Calendar Page
  const CalendarPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Match Calendar</h1>
        
        <div className="space-y-6">
          {[
            { date: 'Oct 18, 2025', opponent: 'State University', venue: 'Home Ground', time: '2:00 PM' },
            { date: 'Oct 25, 2025', opponent: 'City College', venue: 'Away', time: '3:00 PM' },
            { date: 'Nov 2, 2025', opponent: 'Tech Institute', venue: 'Home Ground', time: '1:00 PM' },
            { date: 'Nov 9, 2025', opponent: 'Metro University', venue: 'Neutral', time: '2:30 PM' },
            { date: 'Nov 16, 2025', opponent: 'Regional Finals', venue: 'TBD', time: 'TBD' }
          ].map((match, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <Calendar className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">{match.date}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">vs {match.opponent}</h3>
                    <p className="text-slate-400">
                      {match.venue} • {match.time}
                    </p>
                  </div>
                </div>
                <button className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Coaching Staff Page
  const CoachingPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Coaching Staff</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {[
            { name: 'Michael Roberts', role: 'Head Coach', exp: '15 years', spec: 'Batting & Strategy' },
            { name: 'Sarah Anderson', role: 'Assistant Coach', exp: '8 years', spec: 'Bowling & Fielding' },
            { name: 'Tom Bradley', role: 'Fitness Trainer', exp: '10 years', spec: 'Strength & Conditioning' },
            { name: 'Dr. Emma Wilson', role: 'Sports Psychologist', exp: '12 years', spec: 'Mental Performance' }
          ].map((coach, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{coach.name}</h3>
                  <p className="text-amber-500 font-semibold mb-3">{coach.role}</p>
                  <div className="space-y-1 text-sm">
                    <div className="text-slate-400">
                      <span className="font-medium">Experience:</span> {coach.exp}
                    </div>
                    <div className="text-slate-400">
                      <span className="font-medium">Specialty:</span> {coach.spec}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Timeline Page
  const TimelinePage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">Our Journey</h1>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800"></div>
          
          <div className="space-y-12">
            {[
              { year: '2000', title: 'Foundation', desc: 'Cricket club established with 12 founding members' },
              { year: '2005', title: 'First Championship', desc: 'Won the inaugural Inter-College Tournament' },
              { year: '2010', title: 'New Facilities', desc: 'State-of-the-art cricket ground inaugurated' },
              { year: '2015', title: 'National Recognition', desc: 'Ranked among top 10 college cricket teams nationwide' },
              { year: '2020', title: 'Record Season', desc: 'Achieved historic 20-match winning streak' },
              { year: '2025', title: 'Today', desc: 'Continuing the legacy of excellence with 28 active players' }
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

  // Sponsor Page
  const SponsorPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Support Our Team</h1>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Your contribution helps us maintain facilities, purchase equipment, and provide opportunities for our athletes to excel
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
              <label className="block text-white font-medium mb-2">Organization (if applicable)</label>
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
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
              <div className="text-amber-500 font-bold mb-1">{tier}</div>
              <div className="text-slate-400 text-sm">Sponsor</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Contact Page
  const ContactPage = () => (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <Mail className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
            <p className="text-slate-400">cricket@university.edu</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <Users className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Team Manager</h3>
            <p className="text-slate-400">Alex Kumar</p>
            <p className="text-slate-400">+1 (555) 123-4567</p>
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

  // Render current page
  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'roster': return <RosterPage />;
      case 'stats': return <StatsPage />;
      case 'achievements': return <AchievementsPage />;
      case 'calendar': return <CalendarPage />;
      case 'coaching': return <CoachingPage />;
      case 'timeline': return <TimelinePage />;
      case 'sponsor': return <SponsorPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      {renderPage()}
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-slate-400">
            <p className="mb-2">© 2025 University Cricket Club. All rights reserved.</p>
            <p className="text-sm">Building champions on and off the field</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CricketWebsite;
