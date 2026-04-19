import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Bell, Power, Clock, Settings as SettingsIcon } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { TiltCard, FloatingShape } from '../components/Effects3D';
import { useToast } from '../components/Toast';

export function Settings() {
  const { settings, updateSettings, clearSessions } = useAppContext();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [focusMin, setFocusMin] = useState(Math.round(settings.focusDuration / 60));
  const [shortMin, setShortMin] = useState(Math.round(settings.shortBreakDuration / 60));
  const [longMin, setLongMin] = useState(Math.round(settings.longBreakDuration / 60));
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    updateSettings({
      focusDuration: focusMin * 60,
      shortBreakDuration: shortMin * 60,
      longBreakDuration: longMin * 60,
    });
    setIsSaved(true);
    toast('Timer durations updated', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <PageTransition className="flex flex-col gap-8 pb-12 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <motion.div 
          className="p-3 rounded-2xl border border-white/15 backdrop-blur-md"
          animate={{
            background: `linear-gradient(135deg, ${theme.primary}20, transparent)`,
            boxShadow: `0 0 20px ${theme.primary}15`,
          }}
        >
          <SettingsIcon size={28} className="text-white drop-shadow-md" />
        </motion.div>
        <h1 className="text-4xl font-light tracking-wide drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>Settings</h1>
      </div>

      <div className="grid gap-8">
        
        {/* Timer Durations */}
        <TiltCard glowColor={`${theme.primary}30`} intensity={6} className="rounded-[2rem]">
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden glass-shine">
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-15"
              animate={{ backgroundColor: theme.primary }}
            />
            <div className="absolute bottom-4 right-4 opacity-15">
              <FloatingShape shape={theme.shape} color={theme.primary} size={40} />
            </div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-2.5 rounded-xl border backdrop-blur-md" style={{ borderColor: `${theme.primary}40`, color: theme.primary, background: `${theme.primary}15` }}>
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-light tracking-wide text-white/90" style={{ fontFamily: 'Georgia, serif' }}>Timer Durations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
              {[
                { label: 'Focus (min)', val: focusMin, set: setFocusMin },
                { label: 'Short Break', val: shortMin, set: setShortMin },
                { label: 'Long Break', val: longMin, set: setLongMin },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex flex-col gap-3 group">
                  <label htmlFor={`setting-${label.replace(/\s/g, '-').toLowerCase()}`} className="text-[10px] font-semibold tracking-[0.25em] text-white/40 uppercase group-focus-within:text-white/70 transition-colors pl-2">{label}</label>
                  <input
                    id={`setting-${label.replace(/\s/g, '-').toLowerCase()}`}
                    type="number"
                    min="1" max="120"
                    value={val}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl text-2xl font-extralight text-white transition-all shadow-inner hover:bg-white/10 focus:outline-none"
                    style={{ boxShadow: `0 0 0 0px ${theme.primary}00` }}
                    onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}50`; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = `0 0 0 0px ${theme.primary}00`; }}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end relative z-10">
              <button
                onClick={handleSave}
                className="flex items-center gap-3 px-8 py-3.5 font-medium tracking-wide rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: isSaved ? 'linear-gradient(135deg, #34d399, #059669)' : theme.gradientCSS,
                  boxShadow: `0 0 20px ${isSaved ? 'rgba(52,211,153,0.4)' : `${theme.primary}40`}`,
                }}
              >
                <Save size={18} />
                {isSaved ? 'Saved!' : 'Update Durations'}
              </button>
            </div>
          </section>
        </TiltCard>

        {/* Preferences */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8">
          <h2 className="text-2xl font-light tracking-wide text-white/90 mb-8" style={{ fontFamily: 'Georgia, serif' }}>Preferences</h2>
          
          <div className="flex flex-col gap-6">
            <ToggleRow
              icon={Power}
              color={theme.primary}
              title="Auto-start Flow"
              description="Seamlessly begin the next timer when a session ends."
              checked={settings.autoStart}
              onChange={(v: boolean) => updateSettings({ autoStart: v })}
            />
            
            <div className="h-px bg-white/5 w-full" />
            
            <ToggleRow
              icon={Bell}
              color="#fbbf24"
              title="Subtle Chime"
              description="A gentle notification sound at the end of each session."
              checked={settings.soundEnabled}
              onChange={(v: boolean) => updateSettings({ soundEnabled: v })}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-500/5 backdrop-blur-xl border border-red-500/15 rounded-[2rem] p-8 relative overflow-hidden">
          <motion.div className="absolute -bottom-20 -left-20 w-60 h-60 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="text-2xl font-light text-red-400 mb-2 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Danger Zone</h2>
          <p className="text-sm text-white/40 font-light mb-8">Irreversible data operations.</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 bg-black/20 p-6 rounded-2xl border border-white/5">
            <div>
              <h3 className="font-medium text-white/90 tracking-wide mb-1">Erase All History</h3>
              <p className="text-sm text-white/35 font-light max-w-sm">Permanently delete every session record and statistic.</p>
            </div>
            {showConfirm ? (
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 text-sm font-medium bg-white/10 border border-white/15 text-white rounded-xl hover:bg-white/15 transition-all backdrop-blur-md">Cancel</button>
                <button onClick={() => { clearSessions(); setShowConfirm(false); toast('All session data erased', 'error'); }} className="px-5 py-2.5 text-sm font-medium bg-red-500/70 text-white border border-red-500/50 rounded-xl hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]" aria-label="Confirm erase all data">Confirm</button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:border-red-500/40 transition-all"
              >
                <Trash2 size={18} />
                Clear Data
              </button>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function ToggleRow({ icon: Icon, title, description, checked, onChange, color }: { icon: any; title: string; description: string; checked: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-2">
      <div className="flex items-start gap-5">
        <div className="p-3 rounded-2xl border backdrop-blur-md mt-0.5" style={{ borderColor: `${color}30`, color, background: `${color}15` }}>
          <Icon size={22} />
        </div>
        <div>
          <h3 className="font-medium text-white/90 tracking-wide mb-1 text-lg">{title}</h3>
          <p className="text-sm text-white/40 font-light leading-relaxed max-w-md">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "w-16 h-8 rounded-full transition-all duration-300 relative border backdrop-blur-md flex-shrink-0",
          checked ? "border-white/30" : "bg-black/40 border-white/10"
        )}
        style={checked ? { background: `linear-gradient(135deg, ${color}50, ${color}30)`, boxShadow: `0 0 15px ${color}30` } : {}}
      >
        <motion.div
          layout
          className="w-6 h-6 rounded-full absolute top-[3px]"
          style={{
            backgroundColor: checked ? 'white' : 'rgba(255,255,255,0.4)',
            boxShadow: checked ? `0 0 10px rgba(255,255,255,0.6)` : 'none',
          }}
          animate={{
            left: checked ? 'calc(100% - 1.75rem)' : '0.25rem'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
