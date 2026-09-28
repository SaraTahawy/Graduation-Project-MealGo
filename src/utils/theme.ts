export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'mealgo-theme';

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark';

export const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedTheme) ? storedTheme : null;
};

export const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
  document.body.classList.toggle('dark', theme === 'dark');
  document.body.style.colorScheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
};

export const initializeTheme = () => {
  applyTheme(getPreferredTheme());
};
