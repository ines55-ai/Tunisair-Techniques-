import { Button, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Bouton moderne avec effet gradient
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
 * @param {boolean} loading - Affiche un loader
 * @param {ReactNode} children - Contenu du bouton
 * @param {Object} sx - Styles personnalisés
 */
function GradientButton({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  startIcon,
  endIcon,
  size = 'medium',
  fullWidth = false,
  onClick,
  sx = {},
  ...props
}) {
  const gradients = {
    primary: {
      base: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)',
      hover: 'linear-gradient(135deg, #3A7BC8 0%, #6B5FD1 100%)',
      shadow: 'rgba(74, 144, 226, 0.3)',
    },
    secondary: {
      base: 'linear-gradient(135deg, #9B88FF 0%, #7B68EE 100%)',
      hover: 'linear-gradient(135deg, #8A77EE 0%, #6B5FD1 100%)',
      shadow: 'rgba(123, 104, 238, 0.3)',
    },
    success: {
      base: 'linear-gradient(135deg, #68D391 0%, #48BB78 100%)',
      hover: 'linear-gradient(135deg, #5BC880 0%, #38A169 100%)',
      shadow: 'rgba(72, 187, 120, 0.3)',
    },
    error: {
      base: 'linear-gradient(135deg, #FC8181 0%, #F56565 100%)',
      hover: 'linear-gradient(135deg, #EB7070 0%, #E53E3E 100%)',
      shadow: 'rgba(245, 101, 101, 0.3)',
    },
    warning: {
      base: 'linear-gradient(135deg, #F5C877 0%, #EDB95E 100%)',
      hover: 'linear-gradient(135deg, #E4B766 0%, #D69E47 100%)',
      shadow: 'rgba(237, 185, 94, 0.3)',
    },
    info: {
      base: 'linear-gradient(135deg, #81E6D9 0%, #4FD1C5 100%)',
      hover: 'linear-gradient(135deg, #70D5C8 0%, #38B2AC 100%)',
      shadow: 'rgba(79, 209, 197, 0.3)',
    },
  };

  const gradient = gradients[variant] || gradients.primary;

  const sizes = {
    small: { px: 2, py: 0.8, fontSize: '0.875rem' },
    medium: { px: 3, py: 1.2, fontSize: '0.95rem' },
    large: { px: 4, py: 1.5, fontSize: '1.05rem' },
  };

  const sizeStyles = sizes[size] || sizes.medium;

  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        background: gradient.base,
        boxShadow: `0 4px 12px ${gradient.shadow}`,
        borderRadius: 2,
        ...sizeStyles,
        fontWeight: 600,
        transition: 'all 0.3s ease',
        border: 'none',
        '&:hover': {
          background: gradient.hover,
          boxShadow: `0 6px 20px ${gradient.shadow}`,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: `0 4px 12px ${gradient.shadow}`,
        },
        '&:disabled': {
          background: gradient.base,
          opacity: 0.6,
        },
        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
          transition: 'transform 0.3s ease',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
}

export default GradientButton;
