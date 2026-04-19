import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Timer, LayoutDashboard, List, Settings, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_PROJECTS, PROJECT_THEMES } from '../lib/themes';
import { cn } from '../lib/utils';
import SoftAurora from './SoftAurora';
import VariableProximity from './VariableProximity';

function NavItemLabel({ label }: { label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      <VariableProximity
        label={label}
        fromFontVariationSettings="'wght' 400"
        toFontVariationSettings="'wght' 800"
        containerRef={containerRef}
        radius={120}
        className="text-sm tracking-wide"
      />
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const { theme, currentProject } = useTheme();
  const sidebarTitleRef = useRef(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const navItems = [
    { name: 'Timer', path: '/', icon: Timer, shortcut: '1' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, shortcut: '2' },
    { name: 'Sessions', path: '/sessions', icon: List, shortcut: '3' },
    { name: 'Settings', path: '/settings', icon: Settings, shortcut: '4' },
  ];

  // Global keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full text-white overflow-hidden relative font-sans selection:bg-white/20 bg-[#050510]">
      
      {/* Skip Navigation — Accessibility */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* Dynamic Theme Background — SoftAurora crossfades per project */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <AnimatePresence mode="sync">
          {DEFAULT_PROJECTS.map((proj) => {
            const t = PROJECT_THEMES[proj];
            const isActive = currentProject === proj;
            if (!isActive) return null;
            return (
              <motion.div
                key={proj}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0"
                style={{ zIndex: 1 }}
              >
                <SoftAurora
                  speed={0.2}
                  scale={1.5}
                  brightness={0.6}
                  color1={t.primary}
                  color2={t.secondary}
                  noiseFrequency={2.0}
                  noiseAmplitude={0.8}
                  bandHeight={0.3}
                  bandSpread={1.5}
                  enableMouseInteraction={true}
                  mouseInfluence={0.08}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Subdued Gradient overlay for premium feel */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          animate={{ 
            background: `radial-gradient(ellipse at 30% 20%, ${theme.primary}03 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${theme.secondary}03 0%, transparent 60%), linear-gradient(to bottom, #050510ee, #050510ff)` 
          }}
          transition={{ duration: 1.5 }}
        />
      </div>

      {/* Sidebar ambient glow refined */}
      <div className="hidden md:block pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ 
            background: `radial-gradient(circle at 0% 0%, ${theme.primary}10 0%, transparent 40%)`
          }}
          className="w-full h-full"
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 backdrop-blur-2xl bg-black/30 border-r border-white/5 z-30 relative overflow-hidden" role="navigation" aria-label="Main Navigation">
        {/* Sidebar ambient glow */}
        <motion.div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-30"
          animate={{ backgroundColor: theme.primary }}
          transition={{ duration: 1.5 }}
          aria-hidden="true"
        />
        
        <div className="p-7 relative z-10" ref={sidebarTitleRef}>
          <h1 className="text-lg font-medium tracking-[0.25em] uppercase text-white/80 flex items-center gap-3">
            <motion.div 
              className="w-3 h-3 rounded-full"
              animate={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 0 12px ${theme.glow}`,
              }}
              transition={{ duration: 0.8 }}
              aria-hidden="true"
            />
            <div className="relative">
              <VariableProximity
                label="Aura Timer"
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 900"
                containerRef={sidebarTitleRef}
                radius={100}
                className="cursor-default"
              />
            </div>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-6 relative z-10" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-500 relative overflow-hidden group',
                  isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/80'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active state animated background */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNavBG"
                    className="absolute inset-0 rounded-2xl -z-10 border border-white/10"
                    animate={{
                      background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}10)`,
                      boxShadow: `0 0 30px ${theme.primary}15`,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Inactive hover: sweep gradient from left */}
                {!isActive && (
                  <span className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-0" />
                )}

                {/* Icon with hover scale + glow */}
                <motion.span
                  className="flex items-center justify-center transition-all duration-300"
                  whileHover={{ scale: 1.2 }}
                  animate={isActive ? { 
                    filter: `drop-shadow(0 0 6px ${theme.glow})`, 
                    color: theme.primary,
                  } : {}}
                >
                  <Icon size={20} />
                </motion.span>
                
                {/* Label with hover slide and VariableProximity */}
                <div className="flex-1 transition-transform duration-300 group-hover:translate-x-0.5">
                  <NavItemLabel label={item.name} />
                </div>
                
                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="w-1.5 h-1.5 rounded-full"
                    animate={{ backgroundColor: theme.primary, boxShadow: `0 0 8px ${theme.glow}` }}
                  />
                )}
                
                {/* Keyboard shortcut hint — slides in on hover */}
                <span className="kbd opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300" aria-hidden="true">{item.shortcut}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Keyboard shortcut toggle */}
        <div className="px-4 mb-2 relative z-10">
          <button
            onClick={() => setShowShortcuts(prev => !prev)}
            className="w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all text-xs tracking-wider"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard size={14} />
            <span>Shortcuts</span>
            <kbd className="kbd ml-auto">?</kbd>
          </button>
        </div>
        
        {/* Current theme indicator at bottom */}
        <div className="p-5 relative z-10">
          <motion.div 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
            animate={{ borderColor: `${theme.primary}30` }}
            transition={{ duration: 1 }}
          >
            <span className="text-xl" role="img" aria-label={`${currentProject} theme`}>{theme.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/40 tracking-wider uppercase">Active Project</div>
              <div className="text-sm font-medium text-white/80 truncate">{currentProject}</div>
            </div>
            <motion.div 
              className="w-2 h-2 rounded-full"
              animate={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 0 8px ${theme.glow}`, 
              }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 relative z-20 overflow-y-auto overflow-x-hidden pb-24 md:pb-0 scroll-smooth custom-scrollbar" role="main" tabIndex={-1}>
        <div className="min-h-full max-w-7xl mx-auto p-5 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl z-50 px-2 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]" aria-label="Mobile Navigation" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 flex-1 relative"
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.name}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeMobileNav"
                  className="absolute inset-0 rounded-2xl -z-10"
                  animate={{
                    background: `linear-gradient(to top, ${theme.primary}20, transparent)`,
                  }}
                />
              )}
              <Icon 
                size={22} 
                style={isActive ? { color: theme.primary, filter: `drop-shadow(0 0 8px ${theme.glow})` } : { color: 'rgba(255,255,255,0.4)' }}
                className="transition-all duration-500"
                aria-hidden="true"
              />
              <span className={cn(
                "text-[10px] font-medium tracking-wider",
                isActive ? 'text-white' : 'text-white/40'
              )}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowShortcuts(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-md p-8 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              role="dialog"
              aria-label="Keyboard Shortcuts"
            >
              <h2 className="text-xl font-light tracking-wide mb-6 text-white/90" style={{ fontFamily: 'Georgia, serif' }}>Keyboard Shortcuts</h2>
              <div className="space-y-4">
                {[
                  { keys: ['Space'], desc: 'Play / Pause timer' },
                  { keys: ['R'], desc: 'Reset timer' },
                  { keys: ['S'], desc: 'Skip to next session' },
                  { keys: ['1-4'], desc: 'Navigate between pages' },
                  { keys: ['?'], desc: 'Toggle this dialog' },
                  { keys: ['Esc'], desc: 'Close dialogs' },
                ].map(({ keys, desc }) => (
                  <div key={desc} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{desc}</span>
                    <div className="flex gap-1">
                      {keys.map(k => <kbd key={k} className="kbd">{k}</kbd>)}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="mt-8 w-full py-3 rounded-2xl bg-white/10 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/15 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
