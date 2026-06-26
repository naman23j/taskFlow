import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';
import { getStoredTheme, setStoredTheme } from '../utils/localStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => getStoredTheme() || 'light');

  useEffect(() => {
    setStoredTheme(themeName);
  }, [themeName]);

  const value = useMemo(() => {
    const theme = themeName === 'dark' ? darkTheme : lightTheme;
    return {
      themeName,
      toggleTheme: () => setThemeName((current) => (current === 'dark' ? 'light' : 'dark')),
      themeStyles: {
        appShell: {
          minHeight: '100vh',
          padding: '24px 18px 48px',
        },
      },
      theme,
    };
  }, [themeName]);

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={value.theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
