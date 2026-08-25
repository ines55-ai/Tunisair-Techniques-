import { Card, CardContent, CardHeader, CardActions, alpha } from '@mui/material';

/**
 * Carte moderne avec effets visuels élégants
 * 
 * @param {string} variant - 'elevated' | 'gradient' | 'outlined' | 'glass'
 * @param {string} color - Couleur du thème pour les effets
 * @param {ReactNode} children - Contenu de la carte
 * @param {string} title - Titre de la carte (optionnel)
 * @param {string} subheader - Sous-titre (optionnel)
 * @param {ReactNode} actions - Actions en bas de carte (optionnel)
 */
function ModernCard({
  variant = 'elevated',
  color = 'primary',
  children,
  title,
  subheader,
  actions,
  hover = true,
  sx = {},
  ...props
}) {
  const getVariantStyles = (theme) => {
    const baseStyles = {
      borderRadius: 3,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const hoverStyles = hover
      ? {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 8px 30px rgba(0,0,0,0.12)'
                : '0 8px 30px rgba(0,0,0,0.5)',
          },
        }
      : {};

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow:
            theme.palette.mode === 'light'
              ? '0 4px 20px rgba(0,0,0,0.06)'
              : '0 4px 20px rgba(0,0,0,0.3)',
          ...hoverStyles,
        };

      case 'gradient':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].light || theme.palette[color].main, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette[color].main, 0.1),
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${alpha(theme.palette[color].main, 0.15)} 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          },
          ...hoverStyles,
        };

      case 'outlined':
        return {
          ...baseStyles,
          border: '2px solid',
          borderColor: alpha(theme.palette[color].main, 0.2),
          background: alpha(theme.palette[color].main, 0.02),
          ...hoverStyles,
        };

      case 'glass':
        return {
          ...baseStyles,
          background:
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor:
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          ...hoverStyles,
        };

      default:
        return baseStyles;
    }
  };

  return (
    <Card
      sx={(theme) => ({
        ...getVariantStyles(theme),
        ...sx,
      })}
      {...props}
    >
      {(title || subheader) && (
        <CardHeader
          title={title}
          subheader={subheader}
          titleTypographyProps={{ fontWeight: 700 }}
          sx={{ position: 'relative', zIndex: 1 }}
        />
      )}
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={{ position: 'relative', zIndex: 1 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
}

export default ModernCard;
