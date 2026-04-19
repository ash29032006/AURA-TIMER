export interface ProjectTheme {
  name: string;
  emoji: string;
  primary: string;
  secondary: string;
  glow: string;
  gradient: string;
  gradientCSS: string;
  ringColor: string;
  bgImage: string;
  particleColor: string;
  shape: 'cube' | 'octahedron' | 'sphere' | 'torus' | 'pyramid';
}

export const PROJECT_THEMES: Record<string, ProjectTheme> = {
  Coding: {
    name: 'Coding',
    emoji: '⚡',
    primary: '#22d3ee',
    secondary: '#0891b2',
    glow: 'rgba(34, 211, 238, 0.6)',
    gradient: 'from-cyan-400 to-blue-600',
    gradientCSS: 'linear-gradient(135deg, #22d3ee, #2563eb)',
    ringColor: '#22d3ee',
    bgImage: '/theme-coding.png',
    particleColor: '#22d3ee',
    shape: 'cube',
  },
  Design: {
    name: 'Design',
    emoji: '🎨',
    primary: '#f472b6',
    secondary: '#db2777',
    glow: 'rgba(244, 114, 182, 0.6)',
    gradient: 'from-pink-400 to-rose-600',
    gradientCSS: 'linear-gradient(135deg, #f472b6, #e11d48)',
    ringColor: '#f472b6',
    bgImage: '/theme-design.png',
    particleColor: '#f472b6',
    shape: 'octahedron',
  },
  Writing: {
    name: 'Writing',
    emoji: '✍️',
    primary: '#fbbf24',
    secondary: '#d97706',
    glow: 'rgba(251, 191, 36, 0.6)',
    gradient: 'from-amber-400 to-orange-600',
    gradientCSS: 'linear-gradient(135deg, #fbbf24, #ea580c)',
    ringColor: '#fbbf24',
    bgImage: '/theme-writing.png',
    particleColor: '#fbbf24',
    shape: 'pyramid',
  },
  Ideation: {
    name: 'Ideation',
    emoji: '💡',
    primary: '#a78bfa',
    secondary: '#7c3aed',
    glow: 'rgba(167, 139, 250, 0.6)',
    gradient: 'from-violet-400 to-purple-600',
    gradientCSS: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    ringColor: '#a78bfa',
    bgImage: '/theme-ideation.png',
    particleColor: '#a78bfa',
    shape: 'torus',
  },
  'Life Admin': {
    name: 'Life Admin',
    emoji: '🌿',
    primary: '#34d399',
    secondary: '#059669',
    glow: 'rgba(52, 211, 153, 0.6)',
    gradient: 'from-emerald-400 to-green-600',
    gradientCSS: 'linear-gradient(135deg, #34d399, #059669)',
    ringColor: '#34d399',
    bgImage: '/bg-scenery.png',
    particleColor: '#34d399',
    shape: 'sphere',
  },
};

export const DEFAULT_PROJECTS = Object.keys(PROJECT_THEMES);
