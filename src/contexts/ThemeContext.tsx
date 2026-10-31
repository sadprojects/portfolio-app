import { theme, type ThemeMode } from '@styles/theme';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme') as ThemeMode;
    return stored || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = {
    ...theme,
    colors: theme[mode].colors,
    shadows: theme[mode].shadows,
    mode,
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
