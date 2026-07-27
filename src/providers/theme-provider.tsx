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
import Script from 'next/script';

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
  value?: Record<string, string>;
  nonce?: string;
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
const DEFAULT_THEME = 'system';
const THEMES = ['light', 'dark'];
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
      theme: undefined,
      setTheme: () => {},
      forcedTheme: undefined,
      resolvedTheme: undefined,
      themes: ['light', 'dark'],
      systemTheme: undefined,
    };
  }
  return ctx;
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = ['light', 'dark'],
  forcedTheme,
  value,
  nonce,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string | undefined>(
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
      const root = document.documentElement;
      const resolved = resolveTheme(t);

      const allClasses = themes.map((x) => (value?.[x] ? value[x] : x));
      root.classList.remove(...allClasses);
      const cls = value?.[resolved] || resolved;
      root.classList.add(cls);

      if (enableColorScheme) {
        root.style.colorScheme = resolved;
      }
    },
    [themes, value, resolveTheme, enableColorScheme],
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

  const resolvedTheme = theme ? resolveTheme(theme) : undefined;
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
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  var d = document.documentElement;
  var themes = ${JSON.stringify(themes)};
  var value = ${JSON.stringify(value)};
  var attr = '${attribute}';
  var enableColorScheme = ${enableColorScheme};

  function apply(t) {
    if (t === 'system') {
      t = window.matchMedia('${DARK_MQ}').matches ? 'dark' : 'light';
    }
    var cls = value && value[t] ? value[t] : t;
    d.classList.remove.apply(d.classList, themes.concat(Object.values(value || {})));
    d.classList.add(cls);
    if (enableColorScheme) d.style.colorScheme = t;
  }

  try {
    var stored = localStorage.getItem('${storageKey}') || '${defaultTheme}';
    apply(stored);
  } catch(e) {
    apply('${defaultTheme}');
  }
})();
          `.trim(),
        }}
        nonce={nonce}
      />
    </ThemeContext.Provider>
  );
}
