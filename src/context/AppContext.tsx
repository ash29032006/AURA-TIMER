import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Mode = 'focus' | 'shortBreak' | 'longBreak';

export interface Session {
  id: string;
  startedAt: number;
  duration: number; // in seconds
  mode: Mode;
  projectTag: string;
}

export interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStart: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

interface AppContextType {
  sessions: Session[];
  addSession: (session: Session) => void;
  clearSessions: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStart: false,
  soundEnabled: true,
  theme: 'light',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('timer_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('timer_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('timer_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('timer_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const addSession = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
  };

  const clearSessions = () => setSessions([]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{ sessions, addSession, clearSessions, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
