import { Card, CardContent, Box, Typography, Avatar, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

/**
 * Carte de statistiques moderne pour le dashboard
 */
function DashboardStatsCard({ title, value, icon: Icon, color = 'primary', trend, subtitle }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Couleurs adaptées au mode sombre
  const getColors = (colorName) => {
    const colorPalette = theme.palette[colorName];
    
    if (isDarkMode) {
      return {
        bg: alpha(colorPalette.main, 0.15),
        icon: colorPalette.light || colorPalette.main,
        gradient: `linear-gradient(135deg, ${alpha(colorPalette.main, 0.2)} 0%, ${alpha(colorPalette.dark || colorPalette.main, 0.05)} 100%)`,
      };
    } else {
      return {
        bg: alpha(colorPalette.main, 0.1),
        icon: colorPalette.main,
        gradient: `linear-gradient(135deg, ${alpha(colorPalette.main, 0.1)} 0%, ${alpha(colorPalette.light || colorPalette.main, 0.05)} 100%)`,
      };
    }
  };
  
  const colors = getColors(color);
  
  return (
    <Card
      sx={{
        height: '100%',
        background: colors.gradient,
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: alpha(theme.palette[color].main, 0.1),
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
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="overline" 
              sx={{ 
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark || theme.palette[color].main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                {trend > 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : trend < 0 ? (
                  <TrendingDown color="error" fontSize="small" />
                ) : null}
                <Typography
                  variant="caption"
                  sx={{
                    ml: 0.5,
                    fontWeight: 600,
                    color: trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary',
                  }}
                >
                  {trend > 0 ? '+' : ''}
                  {trend}% vs dernier mois
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: colors.bg,
              color: colors.icon,
              width: 72,
              height: 72,
              boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.25)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            }}
          >
            <Icon sx={{ fontSize: 36 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DashboardStatsCard;
