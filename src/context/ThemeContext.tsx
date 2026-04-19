import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { PROJECT_THEMES } from '../lib/themes';
import type { ProjectTheme } from '../lib/themes';

interface ThemeContextType {
  currentProject: string;
  setCurrentProject: (p: string) => void;
  theme: ProjectTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState('Coding');
  const theme = PROJECT_THEMES[currentProject] || PROJECT_THEMES['Coding'];

  return (
    <ThemeContext.Provider value={{ currentProject, setCurrentProject, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
