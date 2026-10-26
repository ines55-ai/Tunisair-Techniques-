import { useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
  alpha,
  useTheme,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  RestartAlt as ResetIcon,
  Contrast as ContrastIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';

// ─── Font size options ────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { key: 'default', label: 'Par défaut', sampleSize: '1.5rem',   sampleWeight: 400 },
  { key: 'large',   label: 'Grand',      sampleSize: '1.875rem', sampleWeight: 500 },
  { key: 'xlarge',  label: 'Très grand', sampleSize: '2.25rem',  sampleWeight: 700 },
];

function AccessibilityPanel({ open, onClose }) {
  const theme = useTheme();
  const { fontSize, changeFontSize, highContrast, toggleHighContrast, resetA11y } = useThemeMode();
  const titleRef = useRef(null);

  // Move focus to dialog title when it opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => titleRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleReset = () => {
    resetA11y();
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="a11y-dialog-title"
      aria-describedby="a11y-dialog-desc"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: highContrast ? 1 : 3,
          border: highContrast ? `2px solid ${theme.palette.text.primary}` : 'none',
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <DialogTitle
        id="a11y-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pb: 0,
          pt: 3,
          px: 3,
        }}
      >
        <Box>
          <Typography
            ref={titleRef}
            tabIndex={-1}
            variant="h6"
            fontWeight={700}
            component="h2"
            sx={{ '&:focus': { outline: 'none' } }}
          >
            Accessibilité
          </Typography>
          <Typography
            id="a11y-dialog-desc"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, maxWidth: 380 }}
          >
            Ajustez l'affichage selon vos besoins. Les changements s'appliquent
            immédiatement et sont mémorisés sur cet appareil.
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Fermer le panneau d'accessibilité"
          size="small"
          sx={{ ml: 1, mt: -0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>

        {/* ── Text size ──────────────────────────────────────────────────── */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ mb: 1.5 }}
          id="font-size-group-label"
        >
          Taille du texte
        </Typography>

        <Box
          role="group"
          aria-labelledby="font-size-group-label"
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 3 }}
        >
          {FONT_OPTIONS.map((opt) => {
            const isSelected = fontSize === opt.key;
            return (
              <Box
                key={opt.key}
                component="button"
                onClick={() => changeFontSize(opt.key)}
                aria-pressed={isSelected}
                aria-label={`Taille de texte : ${opt.label}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  py: 2,
                  px: 1,
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderRadius: highContrast ? 1 : 2,
                  backgroundColor: isSelected
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                <Typography
                  aria-hidden="true"
                  sx={{
                    fontSize: opt.sampleSize,
                    fontWeight: opt.sampleWeight,
                    lineHeight: 1,
                    color: isSelected ? 'primary.main' : 'text.primary',
                  }}
                >
                  Aa
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={isSelected ? 700 : 500}
                  color={isSelected ? 'primary.main' : 'text.secondary'}
                >
                  {opt.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* ── High contrast ──────────────────────────────────────────────── */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: highContrast ? 1 : 2,
            border: highContrast
              ? `2px solid ${theme.palette.text.primary}`
              : `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.warning.main, 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <ContrastIcon sx={{ color: 'warning.dark', fontSize: 20 }} />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={700}>
              Contraste élevé
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Texte plus sombre, bordures renforcées et fonds simplifiés.
            </Typography>
          </Box>

          <Switch
            checked={highContrast}
            onChange={toggleHighContrast}
            inputProps={{
              'aria-label': highContrast
                ? 'Désactiver le contraste élevé'
                : 'Activer le contraste élevé',
            }}
            color="warning"
          />
        </Paper>

        {/* ── Preview ────────────────────────────────────────────────────── */}
        <Box
          aria-label="Aperçu du texte avec les paramètres actuels"
          sx={{
            border: '1.5px dashed',
            borderColor: 'divider',
            borderRadius: highContrast ? 1 : 2,
            p: 2,
            backgroundColor: alpha(theme.palette.background.default, 0.6),
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 1 }}
          >
            Aperçu
          </Typography>
          <Typography variant="body1">
            Tunisair Technics — Système de gestion des inventaires informatiques.{' '}
            <Box
              component="a"
              href="#"
              onClick={(e) => e.preventDefault()}
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                textDecoration: 'underline',
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                  borderRadius: '2px',
                },
              }}
            >
              Exemple de lien
            </Box>
          </Typography>
        </Box>
      </DialogContent>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          onClick={handleReset}
          startIcon={<ResetIcon aria-hidden="true" />}
          variant="text"
          color="inherit"
          aria-label="Réinitialiser tous les paramètres d'accessibilité"
          sx={{ color: 'text.secondary', mr: 'auto' }}
        >
          Réinitialiser
        </Button>
        <Button
          onClick={handleDone}
          variant="contained"
          aria-label="Fermer le panneau et appliquer les paramètres"
          sx={{
            px: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        >
          Terminer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccessibilityPanel;
