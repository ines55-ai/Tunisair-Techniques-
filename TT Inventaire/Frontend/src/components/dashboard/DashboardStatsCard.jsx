import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

/**
 * Carte de statistiques pour le dashboard
 */
function DashboardStatsCard({ title, value, icon: Icon, color = 'primary', trend, subtitle }) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="overline" sx={{ fontSize: '0.75rem' }}>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend > 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : trend < 0 ? (
                  <TrendingDown color="error" fontSize="small" />
                ) : null}
                <Typography
                  variant="caption"
                  sx={{
                    ml: 0.5,
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
              backgroundColor: `${color}.lighter`,
              color: `${color}.main`,
              width: 64,
              height: 64,
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DashboardStatsCard;
