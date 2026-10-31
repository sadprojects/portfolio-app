export const theme = {
  light: {
    colors: {
      background: '#e8e8e8',
      foreground: '#030303',
      secondary: '#525252',
      accent: '#dcdcdc',
      border: '#c6c6c6',
      card: '#f1f1f1',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  dark: {
    colors: {
      background: '#0a0a0a',
      foreground: '#e8e8e8',
      secondary: '#a3a3a3',
      accent: '#1a1a1a',
      border: '#2c2c2c',
      card: '#111111',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
    },
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
  },
  typography: {
    fonts: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
      display: '"Instrument Serif", Georgia, "Times New Roman", serif',
      hand: '"Caveat", "Segoe Print", cursive',
    },
  },
};

export type Theme = typeof theme;
export type ThemeMode = 'light' | 'dark';
