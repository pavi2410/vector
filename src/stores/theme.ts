import { atom } from 'nanostores';

export type Theme = 'light' | 'dark' | 'auto';

export const themeStore = atom<Theme>('auto');

export function setTheme(theme: Theme) {
  themeStore.set(theme);
  
  // Apply theme to document
  const root = document.documentElement;
  
  if (theme === 'auto') {
    // Use system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemTheme = () => {
      root.classList.toggle('dark', mediaQuery.matches);
    };
    
    applySystemTheme();
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', applySystemTheme);
    
    // Store cleanup function for when theme changes
    return () => mediaQuery.removeEventListener('change', applySystemTheme);
  } else {
    // Apply explicit theme
    root.classList.toggle('dark', theme === 'dark');
  }
  
  // Store theme preference
  localStorage.setItem('vector-theme', theme);
}

// Initialize theme on app start
export function initializeTheme() {
  const stored = localStorage.getItem('vector-theme') as Theme | null;
  const theme = stored || 'auto';
  themeStore.set(theme);
  setTheme(theme);
}
