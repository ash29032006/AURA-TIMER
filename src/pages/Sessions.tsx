import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Clock, LayoutDashboard, Calendar, Search } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { PROJECT_THEMES } from '../lib/themes';
import type { Mode } from '../context/AppContext';

const modeLabels: Record<Mode, string> = {
  focus: 'Deep Focus',
  shortBreak: 'Short Rest',
  longBreak: 'Long Rest',
};

export function Sessions() {
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const [filterProject, setFilterProject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = ['All', ...Array.from(new Set(sessions.map((s) => s.projectTag)))];

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchProject = filterProject === 'All' || s.projectTag === filterProject;
      const matchSearch = s.projectTag.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          modeLabels[s.mode].toLowerCase().includes(searchQuery.toLowerCase());
      return matchProject && matchSearch;
    });
  }, [sessions, filterProject, searchQuery]);

  return (
    <PageTransition className="flex flex-col min-h-[85vh] pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <h1 className="text-4xl font-light tracking-wide drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>Sessions Log</h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/70 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-sm text-white placeholder-white/25 transition-all shadow-inner focus:outline-none focus:border-white/20"
              style={{ boxShadow: `0 0 0 0px ${theme.primary}00` }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}40`; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = `0 0 0 0px ${theme.primary}00`; }}
            />
          </div>
          
          <div className="relative">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-sm font-medium text-white transition-all focus:outline-none focus:border-white/20"
            >
              {projects.map(p => (
                <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col relative">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-[80px] pointer-events-none opacity-10" style={{ backgroundColor: theme.primary }} />

        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-white/40 relative z-10">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <LayoutDashboard size={80} className="opacity-20 mb-6" />
              <p className="text-xl font-light tracking-wide text-white/60 mb-2" style={{ fontFamily: 'Georgia, serif' }}>No sessions yet</p>
              <p className="text-sm tracking-widest uppercase text-white/30">Start a timer to log activity.</p>
            </motion.div>
          </div>
        ) : (
          <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-12 gap-4 px-8 py-5 text-[10px] font-semibold tracking-[0.25em] uppercase text-white/30 bg-black/20 sticky top-0 backdrop-blur-xl border-b border-white/5 z-20">
              <div className="col-span-4 md:col-span-3">Project</div>
              <div className="col-span-3 hidden md:block">Mode</div>
              <div className="col-span-5 md:col-span-4">Date & Time</div>
              <div className="col-span-3 md:col-span-2 text-right">Duration</div>
            </div>
            
            <div className="divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {filteredSessions.map((session, i) => {
                  const projTheme = PROJECT_THEMES[session.projectTag];
                  const dotColor = projTheme ? projTheme.primary : '#60a5fa';
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.5) }}
                      className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-white/5 transition-all group cursor-default"
                    >
                      <div className="col-span-4 md:col-span-3 flex items-center gap-4">
                        <motion.div 
                          className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform"
                          style={{ backgroundColor: dotColor, boxShadow: `0 0 10px ${dotColor}60` }}
                        />
                        <span className="font-medium text-white/90 truncate tracking-wide flex items-center gap-2">
                          {projTheme && <span className="text-sm">{projTheme.emoji}</span>}
                          {session.projectTag}
                        </span>
                      </div>
                      <div className="col-span-3 hidden md:flex items-center h-full">
                        <span className="text-[10px] tracking-[0.15em] uppercase text-white/60 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
                          {modeLabels[session.mode]}
                        </span>
                      </div>
                      <div className="col-span-5 md:col-span-4 flex items-center gap-3 text-sm text-white/50 font-light">
                        <Calendar size={13} className="text-white/30 hidden lg:block" />
                        {new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        <span className="text-white/15">•</span>
                        <Clock size={13} className="text-white/30 hidden lg:block" />
                        {new Date(session.startedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right font-light text-lg tracking-tight text-white/80 font-mono">
                        {Math.round(session.duration / 60)}m
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
