import type { Theme, ThemeMode } from '@styles/theme';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: ThemeMode;
    colors: Theme['light']['colors'];
    shadows: Theme['light']['shadows'];
    transitions: Theme['transitions'];
    typography: Theme['typography'];
  }
}
