import { Theme } from '@styles/theme';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    mode: 'light' | 'dark';
    colors: {
      background: string;
      foreground: string;
      primary: string;
      secondary: string;
      accent: string;
      border: string;
      muted: string;
      card: string;
      cardBorder: string;
      hover?: string;
      disabled?: string;
      textPrimary?: string;
      textSecondary?: string;
      link?: string;
      linkHover?: string;
      codeBackground?: string;
      codeForeground?: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
  }
}
