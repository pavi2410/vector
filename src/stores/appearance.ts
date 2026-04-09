import { persistentMap } from '@nanostores/persistent';

export type Theme = 'light' | 'dark' | 'auto';

export type AppearanceValue = {
  theme: Theme;
  blur: boolean;
}

export const appearanceStore = persistentMap<AppearanceValue>('vector-appearance:', {
  theme: 'auto',
  blur: false,
}, {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
});

// Track the current auto-theme listener so it can be removed when theme changes
let autoThemeCleanup: (() => void) | null = null;

export function setTheme(theme: Theme) {
  // Always remove any previous auto-theme listener before switching
  if (autoThemeCleanup) {
    autoThemeCleanup();
    autoThemeCleanup = null;
  }

  appearanceStore.setKey('theme', theme);

  // Apply theme to document
  const root = document.documentElement;

  if (theme === 'auto') {
    // Use system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemTheme = () => {
      root.classList.toggle('dark', mediaQuery.matches);
    };

    applySystemTheme();

    // Listen for system theme changes and keep a stable cleanup reference
    mediaQuery.addEventListener('change', applySystemTheme);
    autoThemeCleanup = () => mediaQuery.removeEventListener('change', applySystemTheme);
  } else {
    // Apply explicit theme
    root.classList.toggle('dark', theme === 'dark');
  }
}

export function setBlur(enabled: boolean) {
  appearanceStore.setKey('blur', enabled);
  
  // Apply blur to document
  const root = document.documentElement;
  if (enabled) {
    root.setAttribute('data-appearance', 'blur');
  } else {
    root.removeAttribute('data-appearance');
  }
}

// Initialize appearance settings on app start
export function initializeAppearance() {
  const appearance = appearanceStore.get();
  setTheme(appearance.theme);
  setBlur(appearance.blur);
}