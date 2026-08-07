import { createContext, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'themeMode';

const getInitialMode = () => {
  const savedMode = localStorage.getItem(STORAGE_KEY);
  return savedMode === 'dark' ? 'dark' : 'light';
};

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
          background: {
            default: mode === 'light' ? '#f5f7fb' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      }),
    [mode],
  );

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within an AppThemeProvider');
  }
  return context;
};

