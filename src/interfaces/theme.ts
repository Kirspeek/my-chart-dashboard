// Theme type definition
export type Theme = "light" | "dark";

// Theme context interface
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Theme variables interface
export interface ThemeVars {
  [key: string]: string;
}
