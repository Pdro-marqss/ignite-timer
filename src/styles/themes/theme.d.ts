// styled.d.ts ou theme.d.ts
import 'styled-components';

// Definindo a tipagem personalizada para o tema
declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    secondary: string;
    white: string;
  }
}
