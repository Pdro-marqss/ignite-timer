// styled.d.ts ou theme.d.ts
import 'styled-components';
import { defaultTheme } from './default';

// Definindo a tipagem personalizada para o tema
type ThemeType = typeof defaultTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType { }
}
