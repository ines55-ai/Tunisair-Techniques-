import { createContext, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext(null);

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_MODE        = 'themeMode';
const STORAGE_FONT_SIZE   = 'a11yFontSize';   // 'default' | 'large' | 'xlarge'
const STORAGE_CONTRAST    = 'a11yHighContrast'; // 'true' | 'false'

// ─── Font-size scale factors ─────────────────────────────────────────────────
const FONT_SCALES = { default: 1, large: 1.15, xlarge: 1.3 };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStored = (key, fallback) => localStorage.getItem(key) ?? fallback;

const scalePx = (px, factor) =>
  `${parseFloat(px) * factor}rem`;

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode]               = useState(() => getStored(STORAGE_MODE, 'light'));
  const [fontSize, setFontSize]       = useState(() => getStored(STORAGE_FONT_SIZE, 'default'));
  const [highContrast, setHighContrast] = useState(
    () => getStored(STORAGE_CONTRAST, 'false') === 'true'
  );

  // ─── Actions ───────────────────────────────────────────────────────────────
  const toggleColorMode = () =>
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_MODE, next);
      return next;
    });

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem(STORAGE_FONT_SIZE, size);
  };

  const toggleHighContrast = () =>
    setHighContrast(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_CONTRAST, String(next));
      return next;
    });

  const resetA11y = () => {
    changeFontSize('default');
    setHighContrast(false);
    localStorage.setItem(STORAGE_CONTRAST, 'false');
  };

  // ─── Theme ─────────────────────────────────────────────────────────────────
  const theme = useMemo(() => {
    const scale = FONT_SCALES[fontSize] ?? 1;
    const isLight = mode === 'light';

    // High-contrast palette overrides
    const hcText     = isLight ? '#000000' : '#ffffff';
    const hcBg       = isLight ? '#ffffff' : '#000000';
    const hcPaper    = isLight ? '#ffffff' : '#111111';
    const hcPrimary  = isLight ? '#004EA8' : '#72B3FF';  // deeper blue → higher contrast
    const hcDivider  = isLight ? '#000000' : '#ffffff';

    return createTheme({
      palette: {
        mode,
        primary: {
          main:    highContrast ? hcPrimary : (isLight ? '#1B6CC8' : '#5B9FED'),
          light:   '#4A90E2',
          dark:    '#1457A0',
          lighter: isLight ? '#EBF4FC' : '#1E3A5F',
        },
        secondary: {
          main:    highContrast ? (isLight ? '#4A3BAA' : '#C4B5FD') : (isLight ? '#5E4CC7' : '#9B88FF'),
          light:   '#7B68EE',
          dark:    '#4A3BAA',
          lighter: isLight ? '#F0EDFF' : '#2E265F',
        },
        success: { main: '#38A169', light: '#68D391', dark: '#276749' },
        error:   { main: '#C53030', light: '#FC8181', dark: '#9B2C2C' },
        warning: { main: '#D69E47', light: '#F5C877', dark: '#B7791F' },
        info:    { main: '#2B6CB0', light: '#63B3ED', dark: '#2C5282' },
        background: {
          default: highContrast ? hcBg    : (isLight ? '#f5f7fa' : '#0d1117'),
          paper:   highContrast ? hcPaper : (isLight ? '#ffffff'  : '#161b22'),
        },
        text: {
          primary:   highContrast ? hcText                        : (isLight ? '#1e293b' : '#f8fafc'),
          secondary: highContrast ? (isLight ? '#333333' : '#cccccc') : (isLight ? '#64748b' : '#94a3b8'),
        },
        divider: highContrast ? hcDivider : (isLight ? '#e2e8f0' : '#30363d'),
      },

      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        // All sizes scaled by the chosen factor
        h1:        { fontSize: scalePx('2.5', scale), fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
        h2:        { fontSize: scalePx('2',   scale), fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
        h3:        { fontSize: scalePx('1.75',scale), fontWeight: 600, lineHeight: 1.4 },
        h4:        { fontSize: scalePx('1.5', scale), fontWeight: 600, lineHeight: 1.4 },
        h5:        { fontSize: scalePx('1.25',scale), fontWeight: 600, lineHeight: 1.5 },
        h6:        { fontSize: scalePx('1.125',scale),fontWeight: 600, lineHeight: 1.5 },
        subtitle1: { fontSize: scalePx('1',   scale), fontWeight: 500, lineHeight: 1.5 },
        body1:     { fontSize: scalePx('1',   scale), lineHeight: 1.6 },
        body2:     { fontSize: scalePx('0.875',scale),lineHeight: 1.5 },
        caption:   { fontSize: scalePx('0.75',scale), lineHeight: 1.4 },
        button:    { fontWeight: 600, textTransform: 'none', letterSpacing: '0.02em',
                     fontSize: scalePx('0.95', scale) },
      },

      shape: { borderRadius: highContrast ? 4 : 12 },

      shadows: [
        'none',
        highContrast ? 'none' : '0px 2px 4px rgba(0,0,0,0.05)',
        highContrast ? 'none' : '0px 4px 8px rgba(0,0,0,0.08)',
        highContrast ? 'none' : '0px 8px 16px rgba(0,0,0,0.1)',
        highContrast ? 'none' : '0px 12px 24px rgba(0,0,0,0.12)',
        highContrast ? 'none' : '0px 16px 32px rgba(0,0,0,0.15)',
        ...Array(19).fill(highContrast ? 'none' : '0px 16px 32px rgba(0,0,0,0.15)'),
      ],

      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: highContrast ? 4 : 10,
              padding: '10px 24px',
              fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              // High-contrast: stronger visible border
              ...(highContrast && {
                border: '2px solid currentColor',
                boxShadow: 'none !important',
              }),
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              '&:hover': {
                transform: 'translateY(-2px)',
                '@media (prefers-reduced-motion: reduce)': { transform: 'none' },
                ...(highContrast && { transform: 'none' }),
              },
              '&:focus-visible': {
                outline: '3px solid',
                outlineColor: isLight ? '#004EA8' : '#72B3FF',
                outlineOffset: '3px',
              },
            },
            contained: { boxShadow: highContrast ? 'none' : '0 4px 12px rgba(0,0,0,0.1)' },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: highContrast ? 4 : 16,
              border: highContrast ? `2px solid ${hcDivider}` : 'none',
              boxShadow: highContrast
                ? 'none'
                : (isLight ? '0 4px 20px rgba(0,0,0,0.06)' : '0 4px 20px rgba(0,0,0,0.3)'),
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              '&:hover': {
                transform: highContrast ? 'none' : 'translateY(-4px)',
                '@media (prefers-reduced-motion: reduce)': { transform: 'none' },
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              ...(highContrast && { border: `1px solid ${hcDivider}` }),
            },
            rounded: { borderRadius: highContrast ? 4 : 12 },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: highContrast ? 4 : 10,
                ...(highContrast && {
                  '& fieldset': { borderWidth: '2px', borderColor: hcText },
                  '&:hover fieldset': { borderColor: hcPrimary },
                }),
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: highContrast ? 4 : 8,
              fontWeight: highContrast ? 700 : 500,
              ...(highContrast && { border: `2px solid currentColor` }),
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: highContrast ? 4 : 12,
              fontWeight: 500,
              ...(highContrast && { border: `2px solid currentColor` }),
            },
          },
        },
      },
    });
  }, [mode, fontSize, highContrast]);

  const value = useMemo(
    () => ({ mode, toggleColorMode, fontSize, changeFontSize, highContrast, toggleHighContrast, resetA11y }),
    [mode, fontSize, highContrast],
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
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within an AppThemeProvider');
  return ctx;
};
