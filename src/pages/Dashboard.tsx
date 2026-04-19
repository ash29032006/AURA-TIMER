import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PageTransition } from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';
import GlareHover from '../components/GlareHover';
import type { Session } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { PROJECT_THEMES } from '../lib/themes';
import { cn } from '../lib/utils';
import { Clock, CheckSquare, Flame, BarChart3, TrendingUp } from 'lucide-react';
import { TiltCard, FloatingShape } from '../components/Effects3D';
import SpotlightCard from '../components/SpotlightCard';
import { AnimatedCounter } from '../components/InteractiveElements';

function getSessionsInDays(sessions: Session[], numDays: number) {
  const now = Date.now();
  const cutoff = now - numDays * 24 * 60 * 60 * 1000;
  return sessions.filter((s) => s.startedAt >= cutoff);
}

export function Dashboard() {
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const stats = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365;
    const recentSessions = getSessionsInDays(sessions, days);
    const focusSessions = recentSessions.filter(s => s.mode === 'focus');
    const totalFocusSeconds = focusSessions.reduce((acc, s) => acc + s.duration, 0);
    const totalHours = Number((totalFocusSeconds / 3600).toFixed(1));
    const sessionsCount = focusSessions.length;
    const dailyAverage = Number((totalFocusSeconds / 3600 / days).toFixed(1));

    return { totalHours, sessionsCount, dailyAverage, streak: 5,
      deltaTotal: '+12%', deltaSessions: '+5%', deltaStreak: 'New best!', deltaAverage: '-2%' };
  }, [sessions, timeRange]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(name => ({ name, hours: +(Math.random() * 5).toFixed(1) }));
  }, []);

  const projectData = useMemo(() => {
    const focusSessions = sessions.filter(s => s.mode === 'focus');
    const grouped = focusSessions.reduce((acc, s) => {
      acc[s.projectTag] = (acc[s.projectTag] || 0) + s.duration;
      return acc;
    }, {} as Record<string, number>);
    let chartData = Object.keys(grouped).map(k => ({
      name: k, value: Number((grouped[k] / 3600).toFixed(1))
    })).sort((a, b) => b.value - a.value);
    if (chartData.length === 0) {
      chartData = [
        { name: 'Coding', value: 12 }, { name: 'Design', value: 8 },
        { name: 'Writing', value: 5 }, { name: 'Ideation', value: 3 },
      ];
    }
    return chartData;
  }, [sessions]);

  const heatmapData = useMemo(() => Array.from({ length: 18 * 7 }).map(() => Math.floor(Math.random() * 5)), []);

  return (
    <PageTransition className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-wide drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>Dashboard</h1>
          <p className="text-sm text-white/40 mt-1 tracking-wide">Your productivity at a glance</p>
        </div>
        <div className="flex bg-black/30 backdrop-blur-md rounded-2xl p-1.5 border border-white/10" role="tablist" aria-label="Time range filter">
          {(['7d', '30d', 'all'] as const).map(tr => (
            <GlareHover
              key={tr}
              glareColor={theme.primary}
              glareOpacity={0.3}
              className="rounded-xl"
              transitionDuration={600}
            >
              <button
                role="tab"
                aria-selected={timeRange === tr}
                onClick={() => setTimeRange(tr)}
                className={cn(
                  "px-5 py-2 text-sm font-medium rounded-xl transition-all duration-300 relative w-full h-full",
                  timeRange === tr ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                {timeRange === tr && (
                  <motion.div 
                    layoutId="timeRangeActive"
                    className="absolute inset-0 rounded-xl -z-10 border border-white/15"
                    animate={{ background: `linear-gradient(135deg, ${theme.primary}25, transparent)` }}
                  />
                )}
                {tr === 'all' ? 'ALL' : tr.toUpperCase()}
              </button>
            </GlareHover>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards with 3D Tilt, Spotlight, and Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" role="region" aria-label="Productivity statistics">
        {[
          { title: 'Total Focus', value: stats.totalHours, suffix: 'h', delta: stats.deltaTotal, icon: Clock, color: '#22d3ee', shape: 'cube' as const },
          { title: 'Sessions', value: stats.sessionsCount, suffix: '', delta: stats.deltaSessions, icon: CheckSquare, color: '#f472b6', shape: 'octahedron' as const },
          { title: 'Streak', value: stats.streak, suffix: ' days', delta: stats.deltaStreak, icon: Flame, color: '#fbbf24', shape: 'pyramid' as const },
          { title: 'Daily Avg', value: stats.dailyAverage, suffix: 'h', delta: stats.deltaAverage, icon: BarChart3, color: '#a78bfa', shape: 'torus' as const },
        ].map((card, i) => (
          <TiltCard key={card.title} glowColor={`${card.color}15`} intensity={6} className="rounded-3xl">
            <SpotlightCard
              spotlightColor={`${card.color}10`}
              className="border-white/10 rounded-3xl h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 relative overflow-hidden group h-full"
                role="article"
                aria-label={`${card.title}: ${card.value}${card.suffix}`}
              >
                {/* Corner 3D shape */}
                <div className="absolute bottom-3 right-3 opacity-20 group-hover:opacity-50 transition-all duration-700 group-hover:scale-125" aria-hidden="true">
                  <FloatingShape shape={card.shape} color={card.color} size={32} />
                </div>
                
                <div className="flex justify-between items-start relative z-10 mb-4">
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">{card.title}</h3>
                  <div className="p-2 rounded-xl border border-white/10 backdrop-blur-md group-hover:border-white/20 transition-colors" style={{ color: card.color }} aria-hidden="true">
                    <card.icon size={18} />
                  </div>
                </div>
                <div className="relative z-10 mt-auto">
                  <div className="text-4xl font-extralight tracking-tighter mb-2 text-white">
                    <AnimatedCounter value={card.value} suffix={card.suffix} decimals={card.suffix === 'h' ? 1 : 0} />
                  </div>
                  <div className={cn(
                    "text-xs font-medium tracking-wide flex items-center gap-1",
                    card.delta.startsWith('+') || card.delta === 'New best!' ? "text-emerald-400" : "text-white/40"
                  )}>
                    {(card.delta.startsWith('+') || card.delta === 'New best!') && <TrendingUp size={12} />}
                    {card.delta}
                  </div>
                </div>
              </motion.div>
            </SpotlightCard>
          </TiltCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bar Chart — with gradient bars and enhanced tooltip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }} 
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group"
          role="img"
          aria-label="Weekly focus hours bar chart"
        >
          {/* Subtle ambient glow in background */}
          <motion.div 
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-1000"
            style={{ backgroundColor: theme.primary }}
            aria-hidden="true"
          />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-lg font-light text-white/80 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Focus Hours</h2>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-3 h-3 rounded-full" style={{ background: theme.gradientCSS }} />
              <span>Today highlighted</span>
            </div>
          </div>
          
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barCategoryGap="20%">
                <defs>
                  <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.primary} stopOpacity={1}/>
                    <stop offset="100%" stopColor={theme.secondary} stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="barGradInactive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.12)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0.04)" stopOpacity={1}/>
                  </linearGradient>
                  <filter id="barGlow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 500 }} 
                  dy={12}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.85)', 
                    borderColor: `${theme.primary}30`, 
                    borderRadius: '16px', 
                    backdropFilter: 'blur(20px)', 
                    color: 'white',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${theme.primary}10`,
                    padding: '12px 16px',
                    fontSize: '13px',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}
                  itemStyle={{ color: theme.primary }}
                  formatter={(value: number) => [`${value}h`, 'Focus']}
                />
                <Bar dataKey="hours" radius={[10, 10, 4, 4]} animationDuration={1200} animationEasing="ease-out">
                  {weeklyData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === new Date().getDay() ? 'url(#barGradActive)' : 'url(#barGradInactive)'} 
                      filter={index === new Date().getDay() ? 'url(#barGlow)' : undefined}
                      stroke={index === new Date().getDay() ? `${theme.primary}40` : 'transparent'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Bottom stats row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5 relative z-10">
            <div>
              <div className="text-[10px] text-white/30 tracking-wider uppercase">Total this week</div>
              <div className="text-lg font-extralight text-white">{weeklyData.reduce((a, b) => a + b.hours, 0).toFixed(1)}h</div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 tracking-wider uppercase">Daily average</div>
              <div className="text-lg font-extralight text-white">{(weeklyData.reduce((a, b) => a + b.hours, 0) / 7).toFixed(1)}h</div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 tracking-wider uppercase">Best day</div>
              <div className="text-lg font-extralight" style={{ color: theme.primary }}>{Math.max(...weeklyData.map(d => d.hours)).toFixed(1)}h</div>
            </div>
          </div>
        </motion.div>

        {/* Project Breakdown — interactive hover cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }} 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light text-white/80 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Projects</h2>
            <span className="text-xs text-white/30 font-mono">{projectData.reduce((a, b) => a + b.value, 0).toFixed(1)}h total</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-3" role="list" aria-label="Project time breakdown">
            {projectData.map((p, i) => {
              const total = projectData.reduce((a, b) => a + b.value, 0);
              const percent = total > 0 ? Math.round((p.value / total) * 100) : 0;
              const maxVal = Math.max(...projectData.map(d => d.value));
              const barPercent = maxVal > 0 ? (p.value / maxVal) * 100 : 0;
              const projTheme = PROJECT_THEMES[p.name];
              const barColor = projTheme ? projTheme.primary : '#60a5fa';
              return (
                <motion.div 
                  key={p.name} 
                  className="group relative p-3.5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-500 cursor-default" 
                  role="listitem" 
                  aria-label={`${p.name}: ${p.value} hours (${percent}%)`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  {/* Hover glow border */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 20px ${barColor}10, 0 0 15px ${barColor}08` }}
                    aria-hidden="true"
                  />
                  
                  <div className="flex items-center gap-3 mb-2.5 relative z-10">
                    {/* Colored dot with glow */}
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}60` }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="font-medium text-white/80 flex items-center gap-2 flex-1 text-sm">
                      {projTheme && <span className="text-base" role="img" aria-hidden="true">{projTheme.emoji}</span>}
                      {p.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/25 font-mono text-[10px]">{percent}%</span>
                      <span className="text-white/50 font-mono text-xs font-medium">{p.value}h</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative z-10" role="progressbar" aria-valuenow={p.value} aria-valuemin={0} aria-valuemax={total}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPercent}%` }}
                      transition={{ duration: 1.5, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full relative"
                      style={{ 
                        background: projTheme ? projTheme.gradientCSS : barColor,
                        boxShadow: `0 0 10px ${barColor}50`,
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 3s infinite',
                        }}
                        aria-hidden="true"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Heatmap & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7 }} 
          className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-x-auto"
          role="img"
          aria-label="Activity heatmap showing past 18 weeks of focus activity"
        >
          <h2 className="text-lg font-light text-white/80 mb-8 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Activity Pattern</h2>
          <div className="flex gap-[3px] min-w-max">
            {Array.from({ length: 18 }).map((_, col) => (
              <div key={col} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, row) => {
                  const val = heatmapData[col * 7 + row];
                  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  return (
                    <motion.div
                      key={row}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + (col * 0.015) + (row * 0.008) }}
                      className="w-[14px] h-[14px] rounded-[3px] transition-all duration-300 hover:scale-[1.8] hover:z-10 cursor-pointer"
                      style={{
                        backgroundColor: val === 0 ? 'rgba(255,255,255,0.04)' :
                          val === 1 ? `${theme.primary}30` :
                          val === 2 ? `${theme.primary}55` :
                          val === 3 ? `${theme.primary}88` : theme.primary,
                        boxShadow: val >= 3 ? `0 0 6px ${theme.primary}60` : 'none',
                      }}
                      title={`${dayNames[row]}, Week ${col + 1}: ${val} hours`}
                      role="gridcell"
                      aria-label={`${dayNames[row]}, Week ${col + 1}: ${val} hours of focus`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-[10px] text-white/30">
            <span>Less</span>
            {[0.04, 0.3, 0.55, 0.88, 1].map((opacity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-[2px]"
                style={{
                  backgroundColor: i === 0 ? 'rgba(255,255,255,0.04)' : `${theme.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-between">
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] pointer-events-none opacity-20"
            animate={{ backgroundColor: '#fbbf24' }}
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-light text-white/80 mb-4 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>7-Day Streak</h2>
            <div className="flex justify-between items-center mb-8">
              <span className="text-5xl font-extralight tracking-tighter text-white">
                <AnimatedCounter value={5} suffix="" />
                <span className="text-base font-sans text-white/40 ml-2">days</span>
              </span>
              <Flame className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" size={32} aria-hidden="true" />
            </div>
          </div>
          <div className="flex justify-between mt-auto" role="list" aria-label="Weekly streak progress">
            {['M','T','W','T','F','S','S'].map((day, i) => {
              const isDone = i < 5;
              const isToday = i === 4;
              const fullDay = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i];
              return (
                <div key={i} className="flex flex-col items-center gap-3" role="listitem" aria-label={`${fullDay}: ${isDone ? 'completed' : 'not completed'}${isToday ? ' (today)' : ''}`}>
                  <span className="text-[10px] text-white/30 font-medium" aria-hidden="true">{day}</span>
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className={cn(
                      "w-7 h-7 rounded-full border flex items-center justify-center transition-all",
                      isToday ? "border-white bg-white text-black" :
                      isDone ? "border-amber-400/50 bg-amber-400/20 text-amber-400" : "border-white/10 bg-white/5 text-transparent"
                    )}
                    style={{
                      boxShadow: isToday ? `0 0 15px rgba(255,255,255,0.6)` :
                                 isDone ? `0 0 8px rgba(251,191,36,0.3)` : 'none',
                    }}
                  >
                    {(isDone || isToday) && <CheckSquare size={12} aria-hidden="true" />}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
