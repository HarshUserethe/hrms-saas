'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
}

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  forcedTheme?: string;
  resolvedTheme: string | undefined;
  themes: string[];
  systemTheme?: string | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'light';
const DARK_MQ = '(prefers-color-scheme: dark)';

function getSystemTheme(): string {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(DARK_MQ).matches ? 'dark' : 'light';
}

function getStoredTheme(storageKey: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    return localStorage.getItem(storageKey) || fallback;
  } catch {
    return fallback;
  }
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'light',
      setTheme: () => {},
      forcedTheme: undefined,
      resolvedTheme: 'light',
      themes: ['light', 'dark'],
      systemTheme: 'light',
    };
  }
  return ctx;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = ['light', 'dark'],
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(
    () => forcedTheme || getStoredTheme(storageKey, defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState<string>(() =>
    getSystemTheme(),
  );

  const resolveTheme = useCallback(
    (t: string) => {
      if (enableSystem && t === 'system') {
        return getSystemTheme();
      }
      return t;
    },
    [enableSystem],
  );

  const applyTheme = useCallback(
    (t: string) => {
      if (typeof window === 'undefined') return;
      const root = document.documentElement;
      const resolved = resolveTheme(t);

      root.classList.remove('dark', 'light');
      if (resolved === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }

      if (enableColorScheme) {
        root.style.colorScheme = resolved;
      }
    },
    [resolveTheme, enableColorScheme],
  );

  const setTheme = useCallback(
    (t: string) => {
      const effective = forcedTheme || t;
      setThemeState(effective);
      try {
        localStorage.setItem(storageKey, effective);
      } catch {}
      applyTheme(effective);
    },
    [storageKey, applyTheme, forcedTheme],
  );

  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    if (!enableSystem) return;
    const mq = window.matchMedia(DARK_MQ);
    const handler = () => {
      setSystemTheme(getSystemTheme());
      const current = getStoredTheme(storageKey, defaultTheme);
      if (current === 'system') {
        applyTheme('system');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [enableSystem, storageKey, defaultTheme, applyTheme]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [storageKey, applyTheme]);

  const resolvedTheme = resolveTheme(theme);
  const effectiveTheme = forcedTheme || theme;

  const contextValue = useMemo(
    () => ({
      theme: effectiveTheme,
      setTheme,
      forcedTheme,
      resolvedTheme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: enableSystem ? systemTheme : undefined,
    }),
    [
      effectiveTheme,
      setTheme,
      forcedTheme,
      resolvedTheme,
      themes,
      enableSystem,
      systemTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
