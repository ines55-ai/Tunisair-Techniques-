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
            main: mode === 'light' ? '#4A90E2' : '#5B9FED',
            light: '#6BA3E8',
            dark: '#3A7BC8',
            lighter: mode === 'light' ? '#EBF4FC' : '#1E3A5F',
            gradient: 'linear-gradient(135deg, #5B9FED 0%, #4A90E2 100%)',
          },
          secondary: {
            main: mode === 'light' ? '#7B68EE' : '#9B88FF',
            light: '#9B88FF',
            dark: '#5E4CC7',
            lighter: mode === 'light' ? '#F0EDFF' : '#2E265F',
            gradient: 'linear-gradient(135deg, #9B88FF 0%, #7B68EE 100%)',
          },
          success: {
            main: '#48BB78',
            light: '#68D391',
            dark: '#38A169',
            lighter: mode === 'light' ? '#E6F7ED' : '#1C4532',
            gradient: 'linear-gradient(135deg, #68D391 0%, #48BB78 100%)',
          },
          error: {
            main: '#F56565',
            light: '#FC8181',
            dark: '#E53E3E',
            lighter: mode === 'light' ? '#FFF5F5' : '#4A2020',
            gradient: 'linear-gradient(135deg, #FC8181 0%, #F56565 100%)',
          },
          warning: {
            main: '#EDB95E',
            light: '#F5C877',
            dark: '#D69E47',
            lighter: mode === 'light' ? '#FFF9EB' : '#4A3A1A',
            gradient: 'linear-gradient(135deg, #F5C877 0%, #EDB95E 100%)',
          },
          info: {
            main: '#4FD1C5',
            light: '#81E6D9',
            dark: '#38B2AC',
            lighter: mode === 'light' ? '#E6FFFA' : '#1A4D4A',
            gradient: 'linear-gradient(135deg, #81E6D9 0%, #4FD1C5 100%)',
          },
          background: {
            default: mode === 'light' ? '#f5f7fa' : '#0d1117',
            paper: mode === 'light' ? '#ffffff' : '#161b22',
            elevated: mode === 'light' ? '#ffffff' : '#1c2128',
          },
          text: {
            primary: mode === 'light' ? '#1e293b' : '#f8fafc',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8',
          },
          divider: mode === 'light' ? '#e2e8f0' : '#30363d',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.4,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.5,
          },
          h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.5,
          },
          subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02em',
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: [
          'none',
          '0px 2px 4px rgba(0,0,0,0.05)',
          '0px 4px 8px rgba(0,0,0,0.08)',
          '0px 8px 16px rgba(0,0,0,0.1)',
          '0px 12px 24px rgba(0,0,0,0.12)',
          '0px 16px 32px rgba(0,0,0,0.15)',
          ...Array(19).fill('0px 16px 32px rgba(0,0,0,0.15)'),
        ],
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
              contained: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light' 
                  ? '0 4px 20px rgba(0,0,0,0.06)' 
                  : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light' 
                    ? '0 8px 30px rgba(0,0,0,0.12)' 
                    : '0 8px 30px rgba(0,0,0,0.5)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
              rounded: {
                borderRadius: 12,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#f8fafc' : '#1c2128',
                  },
                  '&.Mui-focused': {
                    backgroundColor: mode === 'light' ? '#ffffff' : '#161b22',
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                fontWeight: 500,
              },
            },
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

