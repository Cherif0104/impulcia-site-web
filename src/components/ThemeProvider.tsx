'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeVariant, themes } from '@/src/lib/theme';

interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  themeConfig: typeof themes.institutional;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeVariant>('institutional');

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeConfig: themes[theme]
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

