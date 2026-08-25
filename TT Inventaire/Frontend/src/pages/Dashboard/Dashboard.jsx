import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CardHeader,
  Divider,
  Button,
  Stack,
  LinearProgress,
  Tooltip,
  Fade,
  Grow,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Build as BuildIcon,
  AssignmentInd as AffectIcon,
  Inventory as StockIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { dashboardService } from '../../services/dashboardService';
import DashboardStatsCard from '../../components/dashboard/DashboardStatsCard';
import RecentMovementsCard from '../../components/dashboard/RecentMovementsCard';
import { APP_NAME, COMPANY_NAME } from '../../utils/constants';

function Dashboard() {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setShowContent(true);
    }
  }, [loading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStatistics();
      setData(response);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const total = data?.statistics?.materiels?.total || 0;
  const enService = data?.statistics?.materiels?.enService || 0;
  const enPanne = data?.statistics?.materiels?.enPanne || 0;
  const enMaintenance = data?.statistics?.materiels?.enMaintenance || 0;
  const enStock = data?.statistics?.materiels?.enStock || 0;
  const affectes = data?.statistics?.materiels?.affectes || 0;
  const libres = data?.statistics?.materiels?.libres || 0;
  const categories = data?.statistics?.categories || 0;

  const tauxDisponibilite = total ? Math.round(((enService + enStock) / total) * 100) : 0;
  const tauxAffectation = total ? Math.round((affectes / total) * 100) : 0;
  const tauxCritique = total ? Math.round(((enPanne + enMaintenance) / total) * 100) : 0;
  const sortedCategories = [...(data?.materielsByCategorie || [])].sort((a, b) => b.count - a.count);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Fade in={showContent} timeout={600}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 3 }} spacing={2}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Tableau de Bord
              </Typography>
            <Typography variant="body1" color="text.secondary">
              Vue d'ensemble de l'inventaire - {COMPANY_NAME} ({APP_NAME})
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary">
                Dernière mise à jour: {lastUpdated.toLocaleString('fr-FR')}
              </Typography>
            )}
            </Box>
            <Button
              variant="contained"
              size="medium"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              sx={{
                background: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                color: 'white',
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3A7BC8 0%, #6B5FD1 100%)',
                  boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '& .MuiButton-startIcon': {
                  transition: 'transform 0.5s ease',
                },
                '&:hover .MuiButton-startIcon': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              Actualiser
            </Button>
          </Stack>
        </Fade>

        <Fade in={showContent} timeout={800}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Alert 
                severity={tauxDisponibilite >= 80 ? 'success' : 'warning'}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(tauxDisponibilite >= 80 ? theme.palette.success.main : theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Disponibilité opérationnelle: {tauxDisponibilite}%
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert 
                severity={tauxCritique > 20 ? 'error' : 'info'}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(tauxCritique > 20 ? theme.palette.error.main : theme.palette.info.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Matériels critiques (panne + maintenance): {enPanne + enMaintenance}
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert 
                severity="info" 
                icon={<TrendingUpIcon fontSize="inherit" />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Taux d'affectation du parc: {tauxAffectation}%
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Fade>

        {/* Statistiques principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={600}>
              <div>
                <DashboardStatsCard
                  title="Total Matériels"
                  value={total}
                  icon={ComputerIcon}
                  color="primary"
                />
              </div>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={800}>
              <div>
                <DashboardStatsCard
                  title="Matériels Affectés"
                  value={affectes}
                  icon={AffectIcon}
                  color="success"
                  subtitle={`${tauxAffectation}% du total`}
                />
              </div>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={1000}>
              <div>
                <DashboardStatsCard
                  title="Matériels Libres"
                  value={libres}
                  icon={StockIcon}
                  color="info"
                  subtitle="Disponibles en stock"
                />
              </div>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={1200}>
              <div>
                <DashboardStatsCard
                  title="En Panne"
                  value={enPanne}
                  icon={ErrorIcon}
                  color="error"
                  subtitle="Nécessitent attention"
                />
              </div>
            </Grow>
          </Grid>
        </Grid>

        {/* Statistiques secondaires */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={600}>
              <div>
                <DashboardStatsCard
                  title="Agents"
                  value={data?.statistics.agents || 0}
                  icon={PeopleIcon}
                  color="success"
                />
              </div>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={800}>
              <div>
                <DashboardStatsCard
                  title="Bureaux"
                  value={data?.statistics.bureaux || 0}
                  icon={BusinessIcon}
                  color="info"
                />
              </div>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={1000}>
              <div>
                <DashboardStatsCard
                  title="Catégories"
                  value={categories}
                  icon={CategoryIcon}
                  color="warning"
                />
              </div>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={showContent} timeout={1200}>
              <div>
                <DashboardStatsCard
                  title="Disponibilité"
                  value={`${tauxDisponibilite}%`}
                  icon={CheckCircleIcon}
                  color="primary"
                  subtitle={`${enService + enStock} opérationnels`}
                />
              </div>
            </Grow>
          </Grid>
        </Grid>

        {/* Alertes */}
        {enPanne > 0 && (
          <Fade in={showContent} timeout={1000}>
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                ⚠️ Attention: {enPanne} matériel(s) en panne nécessite(nt) votre attention
              </Typography>
            </Alert>
          </Fade>
        )}

        <Grid container spacing={3}>
          {/* Derniers mouvements */}
          <Grid item xs={12} md={6}>
            <Fade in={showContent} timeout={1200}>
              <div>
                <RecentMovementsCard />
              </div>
            </Fade>
          </Grid>

          {/* Matériels par catégorie */}
          <Grid item xs={12} md={6}>
            <Fade in={showContent} timeout={1200}>
              <Card>
                <CardHeader
                  title="Matériels par Catégorie"
                  subheader="Répartition par type"
                  titleTypographyProps={{ fontWeight: 700 }}
                />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {sortedCategories.length > 0 ? (
                  <List>
                    {sortedCategories.map((cat, index) => {
                      const progress = total ? Math.round((cat.count / total) * 100) : 0;
                      return (
                      <ListItem key={index} divider={index < sortedCategories.length - 1}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <ListItemText
                              primary={cat.nom}
                              secondary={`${cat.count} matériel(s)`}
                              sx={{ m: 0 }}
                            />
                            <Tooltip title={`${progress}% du parc`}>
                              <Chip
                                label={cat.count}
                                color="primary"
                                variant="filled"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                }}
                              />
                            </Tooltip>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              },
                            }}
                          />
                        </Box>
                      </ListItem>
                    )})}
                  </List>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucune donnée disponible
                    </Typography>
                  </Box>
                )}
              </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Statut des matériels - Vue d'ensemble */}
          <Grid item xs={12}>
            <Fade in={showContent} timeout={1400}>
              <Card>
                <CardHeader
                  title="Répartition par Statut"
                  subheader="État actuel de tous les matériels"
                  titleTypographyProps={{ fontWeight: 700 }}
                />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        border: '2px solid', 
                        borderColor: alpha(theme.palette.success.main, 0.3),
                        borderRadius: 3,
                        background: alpha(theme.palette.success.main, 0.05),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.2)}`,
                        },
                      }}
                    >
                      <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1.5 }} />
                      <Typography variant="h3" color="success.main" fontWeight={800}>
                        {data?.statistics.materiels.enService || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        En Service
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        border: '2px solid', 
                        borderColor: alpha(theme.palette.error.main, 0.3),
                        borderRadius: 3,
                        background: alpha(theme.palette.error.main, 0.05),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${alpha(theme.palette.error.main, 0.2)}`,
                        },
                      }}
                    >
                      <ErrorIcon color="error" sx={{ fontSize: 48, mb: 1.5 }} />
                      <Typography variant="h3" color="error.main" fontWeight={800}>
                        {data?.statistics.materiels.enPanne || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        En Panne
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        border: '2px solid', 
                        borderColor: alpha(theme.palette.warning.main, 0.3),
                        borderRadius: 3,
                        background: alpha(theme.palette.warning.main, 0.05),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.2)}`,
                        },
                      }}
                    >
                      <BuildIcon color="warning" sx={{ fontSize: 48, mb: 1.5 }} />
                      <Typography variant="h3" color="warning.main" fontWeight={800}>
                        {data?.statistics.materiels.enMaintenance || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        En Maintenance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        border: '2px solid', 
                        borderColor: alpha(theme.palette.info.main, 0.3),
                        borderRadius: 3,
                        background: alpha(theme.palette.info.main, 0.05),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.2)}`,
                        },
                      }}
                    >
                      <StockIcon color="info" sx={{ fontSize: 48, mb: 1.5 }} />
                      <Typography variant="h3" color="info.main" fontWeight={800}>
                        {data?.statistics.materiels.enStock || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        En Stock
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
