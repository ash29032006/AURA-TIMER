import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Sparkles } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import type { Mode } from '../context/AppContext';
import { formatTime, cn } from '../lib/utils';
import { DEFAULT_PROJECTS, PROJECT_THEMES } from '../lib/themes';
import { FloatingShape, ParticleField, MagneticButton, TiltCard } from '../components/Effects3D';
import MagicRings from '../components/MagicRings';
import ShinyText from '../components/ShinyText';
import GlareHover from '../components/GlareHover';
import { KeyboardShortcut } from '../components/InteractiveElements';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

const modeLabels: Record<Mode, string> = {
  focus: 'Deep Focus',
  shortBreak: 'Short Rest',
  longBreak: 'Long Rest',
};

const modeDescriptions: Record<Mode, string> = {
  focus: 'Time to concentrate on your task',
  shortBreak: 'Take a brief rest to recharge',
  longBreak: 'A longer break to fully recover',
};

export function Timer() {
  const { settings, addSession } = useAppContext();
  const { currentProject, setCurrentProject, theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration);
  const [isActive, setIsActive] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const durationStr = mode === 'focus' ? 'focusDuration' : mode === 'shortBreak' ? 'shortBreakDuration' : 'longBreakDuration';
  const totalDuration = settings[durationStr];
  const isBreakMode = mode !== 'focus';

  // Global Parallax State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring out the raw mouse movement
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  // Constrain rotation to ±15 degrees and translation to ±20px
  const rotateX = useTransform(smoothMouseY, [-1, 1], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-15, 15]);
  const translateX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const translateY = useTransform(smoothMouseY, [-1, 1], [-20, 20]);

  const handleGlobalMouseMove = useCallback((e: React.MouseEvent) => {
    // Normalize coordinates between -1 and 1
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) * 2 - 1;
    const y = (e.clientY / innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setTimeLeft(settings[durationStr]);
    setIsActive(false);
  }, [mode, settings, durationStr]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Update document title with timer
  useEffect(() => {
    const { m, s } = formatTime(timeLeft);
    if (isActive) {
      document.title = `${m}:${s} — ${modeLabels[mode]} | Aura Timer`;
    } else {
      document.title = 'Aura Timer — Premium Focus Timer';
    }
    return () => { document.title = 'Aura Timer — Premium Focus Timer'; };
  }, [timeLeft, isActive, mode]);

  const handleComplete = () => {
    setIsActive(false);
    addSession({
      id: Math.random().toString(36).substring(2, 9),
      startedAt: Date.now() - (totalDuration * 1000),
      duration: totalDuration,
      mode,
      projectTag: currentProject,
    });
    if (settings.soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    toast(`${modeLabels[mode]} complete! ${totalDuration / 60}m for ${currentProject}`, 'success');
    setShowModal(true);
  };

  const toggleTimer = useCallback(() => setIsActive(!isActive), [isActive]);
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(totalDuration);
    toast('Timer reset', 'info', 2000);
  }, [totalDuration, toast]);
  const skipTimer = useCallback(() => {
    setIsActive(false);
    handleComplete();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (showModal) {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          handleNextAction();
        }
        return;
      }
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleTimer();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetTimer();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          skipTimer();
          break;
        case 'Escape':
          setShowProjects(false);
          break;
        case '1':
          navigate('/');
          break;
        case '2':
          navigate('/dashboard');
          break;
        case '3':
          navigate('/sessions');
          break;
        case '4':
          navigate('/settings');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, resetTimer, skipTimer, showModal, navigate]);

  const handleNextAction = () => {
    setShowModal(false);
    setMode(mode === 'focus' ? 'shortBreak' : 'focus');
    if (settings.autoStart) setTimeout(() => setIsActive(true), 600);
  };

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progressPercent * circumference;
  const { m, s } = formatTime(timeLeft);

  return (
    <div onMouseMove={handleGlobalMouseMove} className="w-full h-full perspective-[1000px]">
      <PageTransition className="flex flex-col items-center justify-center min-h-[85vh] relative pt-12 md:pt-0">
      
      {/* Floating particles (theme-colored) */}
      <div aria-hidden="true">
        <ParticleField color={theme.particleColor} count={24} />
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-black/30 backdrop-blur-xl border border-white/10 p-1.5 rounded-full mb-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative z-20" role="tablist" aria-label="Timer mode">
        {(Object.keys(modeLabels) as Mode[]).map((m) => (
          <GlareHover
            key={m}
            glareColor={theme.primary}
            glareOpacity={0.4}
            className="rounded-full"
            transitionDuration={600}
          >
            <button
              role="tab"
              aria-selected={mode === m}
              aria-label={`${modeLabels[m]} — ${modeDescriptions[m]}`}
              onClick={() => { setMode(m); setIsActive(false); }}
              className={cn(
                "relative px-7 py-2.5 text-sm font-medium transition-all duration-300 z-10 w-full rounded-full tracking-wide",
                mode === m ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              {mode === m && (
                <motion.div
                  layoutId="activeModeTab"
                  className="absolute inset-0 rounded-full -z-10 border border-white/20"
                  animate={{
                    background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}15)`,
                    boxShadow: `0 0 20px ${theme.primary}20`,
                  }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                />
              )}
              {modeLabels[m]}
            </button>
          </GlareHover>
        ))}
      </div>

      {/* Timer Ring with 3D floating shape and Magic Rings */}
      <motion.div
        className="relative flex items-center justify-center group mb-12 w-[400px] h-[400px]"
        role="timer"
        aria-label={`${modeLabels[mode]} timer: ${m} minutes ${s} seconds remaining`}
        aria-live="polite"
        aria-atomic="true"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d" // Enables inner children to pop out
        }}
        animate={isActive ? {
          y: [0, -3, 0, 2, 0],
          x: [0, 1.5, 0, -1.5, 0],
        } : {}}
        transition={isActive ? {
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        } : { duration: 0.6 }}
      >
        {/* Background MagicRings Effect */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-auto transition-opacity duration-1000 group-hover:opacity-100"
          style={{ transform: 'scale(1.4)' }}
          aria-hidden="true"
          animate={{ opacity: isActive ? [0.55, 0.75, 0.55] : 0.7 }}
          transition={isActive ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : { duration: 1 }}
        >
          <MagicRings
            color={theme.primary}
            colorTwo={theme.secondary || '#6366F1'}
            ringCount={isActive ? 5 : 4}
            speed={isActive ? 0.6 : 0.3}
            attenuation={12}
            lineThickness={1.2}
            baseRadius={0.3}
            radiusStep={0.07}
            scaleRate={0.06}
            opacity={isActive ? 0.7 : 0.5}
            blur={2}
            noiseAmount={isActive ? 0.08 : 0.05}
            rotation={0}
            ringGap={1.4}
            fadeIn={0.8}
            fadeOut={0.6}
            followMouse={true}
            mouseInfluence={isActive ? -0.03 : 0.1}
            hoverScale={isActive ? 1 : 1.05}
            parallax={0.02}
            clickBurst={false}
          />
        </motion.div>

        {/* Breathing circle for break modes */}
        {isBreakMode && isActive && (
          <div 
            className="absolute w-[350px] h-[350px] rounded-full breathing-circle pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${theme.primary}15 0%, transparent 70%)`,
              border: `1px solid ${theme.primary}20`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Ambient glow — breathes when active like a calm heartbeat */}
        <motion.div 
          className="absolute rounded-full blur-[80px] pointer-events-none"
          animate={isActive ? { 
            backgroundColor: theme.primary,
            opacity: [0.15, 0.28, 0.15],
            width: [380, 420, 380],
            height: [380, 420, 380],
            scale: [1, 1.04, 1],
          } : {
            backgroundColor: theme.primary,
            opacity: 0.08,
            width: 300,
            height: 300,
            scale: 1,
          }}
          transition={isActive ? {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          } : { duration: 1.5 }}
          aria-hidden="true"
        />

        {/* Morphing background blob */}
        <motion.div
          className="absolute w-[280px] h-[280px] pointer-events-none opacity-10"
          animate={{ backgroundColor: theme.primary }}
          style={{ animation: 'morph-blob 15s ease-in-out infinite' }}
          aria-hidden="true"
        />

        {/* 3D animated shape that changes per project */}
        <div className="absolute pointer-events-none z-0 opacity-60" style={{ animation: 'float 8s ease-in-out infinite', transform: 'translateZ(20px)' }} aria-hidden="true">
          <FloatingShape shape={theme.shape} color={theme.primary} size={80} />
        </div>

        <svg className="w-[340px] h-[340px] drop-shadow-2xl z-10 relative" style={{ transform: 'translateZ(40px) rotate(-90deg)' }} aria-hidden="true">
          {/* Track ring */}
          <circle
            cx="170" cy="170" r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Faint pulsing outer ring — slow rotation when active for calm lively feel */}
          <motion.circle
            cx="170" cy="170" r={radius + 8}
            stroke={theme.primary}
            strokeWidth="1"
            fill="transparent"
            strokeDasharray="6 12"
            animate={isActive ? { 
              opacity: [0.15, 0.35, 0.15],
              rotate: [0, 360],
            } : { opacity: 0.1, rotate: 0 }}
            transition={isActive ? { 
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            } : { duration: 0.5 }}
            style={{ transformOrigin: '170px 170px' }}
          />
          {/* Second decorative ring — counter-rotates for depth */}
          {isActive && (
            <motion.circle
              cx="170" cy="170" r={radius + 15}
              stroke={theme.primary}
              strokeWidth="0.5"
              fill="transparent"
              strokeDasharray="3 18"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0], rotate: [0, -360] }}
              transition={{ 
                opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 180, repeat: Infinity, ease: 'linear' },
              }}
              style={{ transformOrigin: '170px 170px' }}
            />
          )}
          {/* Progress ring (themed) — glow breathes gently when active */}
          <motion.circle
            cx="170" cy="170" r={radius}
            strokeWidth="5"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ 
              strokeDashoffset,
              stroke: theme.primary,
              filter: isActive 
                ? [`drop-shadow(0 0 8px ${theme.glow})`, `drop-shadow(0 0 14px ${theme.glow})`, `drop-shadow(0 0 8px ${theme.glow})`]  
                : `drop-shadow(0 0 10px ${theme.glow})`,
            }}
            transition={{ 
              strokeDashoffset: { duration: 1, ease: "linear" }, 
              stroke: { duration: 1 },
              filter: isActive ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.5 },
            }}
          />
          {/* Glow endpoint dot */}
          {progressPercent > 0.01 && (
            <motion.circle
              cx="170" cy="170" r="4"
              fill={theme.primary}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ 
                filter: `drop-shadow(0 0 6px ${theme.glow})`,
                transformOrigin: '170px 170px',
                transform: `rotate(${progressPercent * 360}deg) translateY(-${radius}px)`,
              }}
            />
          )}
        </svg>

        {/* Digital Display */}
        <div className="absolute flex flex-col items-center pointer-events-none z-20" style={{ transform: 'translateZ(80px)' }}>
          {/* Screen reader accessible time */}
          <div className="sr-only" aria-live="assertive" aria-atomic="true">
            {m} minutes and {s} seconds remaining in {modeLabels[mode]} mode
          </div>

          {/* Subtle glow halo behind digits — breathes when active */}
          {isActive && (
            <motion.div
              className="absolute w-[200px] h-[100px] rounded-full blur-[40px] pointer-events-none"
              animate={{ 
                opacity: [0.05, 0.12, 0.05],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ backgroundColor: theme.primary }}
              aria-hidden="true"
            />
          )}
          
          <div className="text-7xl font-extralight tracking-tighter flex items-center text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace" }} aria-hidden="true">
            <Digit digit={m[0]} />
            <Digit digit={m[1]} />
            <motion.span
              className="mx-2 pb-3 text-5xl"
              animate={{ opacity: isActive ? [1, 0.2, 1] : 0.5 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: theme.primary }}
            >:</motion.span>
            <Digit digit={s[0]} />
            <Digit digit={s[1]} />
          </div>
          <motion.div 
            className="mt-4 text-xs font-medium tracking-[0.4em] uppercase flex items-center gap-2"
            animate={{ color: `${theme.primary}cc` }}
          >
            <span role="img" aria-label={`${currentProject} theme`}>{theme.emoji}</span>
            <ShinyText text={currentProject} disabled={false} speed={3} className="tracking-[0.4em]" />
          </motion.div>

          {/* Breathing instruction for break mode */}
          {isBreakMode && isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-[10px] tracking-[0.3em] text-white/30 uppercase"
            >
              breathe in... breathe out...
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Controls with magnetic hover + keyboard hints */}
      <div className="flex items-center gap-8 mb-14 relative z-20">
        <div className="flex flex-col items-center gap-2">
          <MagneticButton
            onClick={resetTimer}
            ariaLabel="Reset Timer (press R)"
            className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] active:scale-90"
          >
            <RotateCcw size={22} />
          </MagneticButton>
          <KeyboardShortcut keys={['R']} className="opacity-0 group-hover:opacity-100 md:opacity-50" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <MagneticButton
            onClick={toggleTimer}
            ariaLabel={isActive ? "Pause Timer (press Space)" : "Start Timer (press Space)"}
            className="w-24 h-24 flex items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-500 hover:scale-110 active:scale-95"
          >
            <motion.div
              className="absolute inset-0 rounded-full -z-10"
              animate={{
                background: `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}20)`,
                borderColor: `${theme.primary}60`,
                boxShadow: isActive 
                  ? `0 0 40px ${theme.primary}40, inset 0 2px 4px rgba(255,255,255,0.3)` 
                  : `0 0 20px ${theme.primary}20, inset 0 2px 4px rgba(255,255,255,0.2)`,
              }}
              transition={{ duration: 0.8 }}
            />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={isActive ? 'pause' : 'play'}
                initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isActive 
                  ? <Pause size={40} className="fill-current drop-shadow-md" /> 
                  : <Play size={40} className="fill-current ml-2 drop-shadow-md" />
                }
              </motion.div>
            </AnimatePresence>
          </MagneticButton>
          <KeyboardShortcut keys={['Space']} className="opacity-0 group-hover:opacity-100 md:opacity-50" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <MagneticButton
            onClick={skipTimer}
            ariaLabel="Skip Timer (press S)"
            className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] active:scale-90"
          >
            <SkipForward size={22} />
          </MagneticButton>
          <KeyboardShortcut keys={['S']} className="opacity-0 group-hover:opacity-100 md:opacity-50" />
        </div>
      </div>

      {/* Project Picker — Card Grid with 3D Tilt */}
      <div className="relative z-30 w-full max-w-lg">
        <button
          onClick={() => setShowProjects(!showProjects)}
          aria-expanded={showProjects}
          aria-haspopup="listbox"
          aria-label={`Current project: ${currentProject}. Click to change project.`}
          className="mx-auto flex items-center gap-3 px-8 py-3.5 rounded-2xl border backdrop-blur-xl hover:scale-105 transition-all text-sm font-medium shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          style={{
            borderColor: `${theme.primary}30`,
            background: `linear-gradient(135deg, ${theme.primary}15, transparent)`,
          }}
        >
          <span className="text-lg" role="img" aria-hidden="true">{theme.emoji}</span>
          <span className="tracking-wide">{currentProject}</span>
          <motion.span
            animate={{ rotate: showProjects ? 180 : 0 }}
            className="text-white/40 text-xs"
            aria-hidden="true"
          >▼</motion.span>
        </button>

        <AnimatePresence>
          {showProjects && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 22 }}
              className="absolute bottom-full left-0 right-0 mb-4 p-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
              role="listbox"
              aria-label="Select a project"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DEFAULT_PROJECTS.map((proj, i) => {
                  const t = PROJECT_THEMES[proj];
                  const isSelected = currentProject === proj;
                  return (
                    <TiltCard 
                      key={proj} 
                      glowColor={`${t.primary}40`}
                      intensity={12}
                      className="rounded-2xl"
                    >
                      <motion.button
                        role="option"
                        aria-selected={isSelected}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setCurrentProject(proj); setShowProjects(false); toast(`Switched to ${proj}`, 'info', 2000); }}
                        className={cn(
                          "w-full p-5 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden group glass-shine",
                          isSelected 
                            ? "border-white/30 bg-white/10" 
                            : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15"
                        )}
                      >
                        {/* Background thumbnail */}
                        <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-700" aria-hidden="true">
                          <img src={t.bgImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-black/60" />
                        </div>

                        {/* Themed border glow on hover */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl -z-5 pointer-events-none"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          style={{
                            boxShadow: `inset 0 0 30px ${t.primary}15, 0 0 20px ${t.primary}10`,
                          }}
                          aria-hidden="true"
                        />

                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl" role="img" aria-label={proj}>{t.emoji}</span>
                          <motion.div
                            className="w-2.5 h-2.5 rounded-full"
                            animate={{
                              backgroundColor: isSelected ? t.primary : 'rgba(255,255,255,0.2)',
                              boxShadow: isSelected ? `0 0 12px ${t.glow}` : 'none',
                            }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-sm font-medium text-white/90 tracking-wide">{proj}</div>
                        
                        {/* Mini 3D shape in corner */}
                        <div className="absolute bottom-2 right-2 opacity-30 group-hover:opacity-60 transition-opacity" aria-hidden="true">
                          <FloatingShape shape={t.shape} color={t.primary} size={24} />
                        </div>
                      </motion.button>
                    </TiltCard>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Complete Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Session complete">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-lg"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="relative w-full max-w-sm p-10 rounded-[2.5rem] border border-white/15 backdrop-blur-2xl flex flex-col items-center text-center overflow-hidden"
              style={{
                background: `linear-gradient(160deg, ${theme.primary}15 0%, rgba(0,0,0,0.6) 50%, ${theme.secondary}10 100%)`,
                boxShadow: `0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px ${theme.primary}10, inset 0 1px 1px rgba(255,255,255,0.2)`,
              }}
            >
              <div aria-hidden="true">
                <ParticleField color={theme.particleColor} count={12} />
              </div>
              
              <div className="mb-6 relative" aria-hidden="true">
                <FloatingShape shape={theme.shape} color={theme.primary} size={64} />
              </div>
              
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white mb-8 border border-white/20"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary}30, transparent)`,
                  boxShadow: `0 0 30px ${theme.primary}30`,
                }}
                aria-hidden="true"
              >
                <Sparkles size={36} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>

              <h2 className="text-3xl font-light mb-3 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Excellent.</h2>
              <p className="text-white/60 mb-10 text-sm leading-relaxed">
                You completed a <span className="font-medium" style={{ color: theme.primary }}>{totalDuration / 60}m</span> session 
                for <strong className="text-white font-medium">{currentProject}</strong>.
              </p>
              
              <button
                onClick={handleNextAction}
                autoFocus
                className="w-full py-4 rounded-2xl font-medium tracking-wide hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: theme.gradientCSS,
                  boxShadow: `0 0 25px ${theme.primary}40`,
                }}
              >
                Start {mode === 'focus' ? 'Rest' : 'Focus'}
              </button>
              <p className="mt-3 text-[10px] text-white/30 tracking-wider">Press Enter or Escape to continue</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </PageTransition>
    </div>
  );
}

function Digit({ digit }: { digit: string }) {
  return (
    <div className="relative w-[1ch] h-[1.1em] overflow-hidden leading-none tabular-nums mt-1">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center pt-1"
          aria-hidden="true"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
