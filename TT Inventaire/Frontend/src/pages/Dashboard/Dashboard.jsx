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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 3 }} spacing={2}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
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
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDashboardData}
          >
            Actualiser
          </Button>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Alert severity={tauxDisponibilite >= 80 ? 'success' : 'warning'}>
              <Typography variant="body2" fontWeight="medium">
                Disponibilité opérationnelle: {tauxDisponibilite}%
              </Typography>
            </Alert>
          </Grid>
          <Grid item xs={12} md={4}>
            <Alert severity={tauxCritique > 20 ? 'error' : 'info'}>
              <Typography variant="body2" fontWeight="medium">
                Matériels critiques (panne + maintenance): {enPanne + enMaintenance}
              </Typography>
            </Alert>
          </Grid>
          <Grid item xs={12} md={4}>
            <Alert severity="info" icon={<TrendingUpIcon fontSize="inherit" />}>
              <Typography variant="body2" fontWeight="medium">
                Taux d'affectation du parc: {tauxAffectation}%
              </Typography>
            </Alert>
          </Grid>
        </Grid>

        {/* Statistiques principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Total Matériels"
              value={total}
              icon={ComputerIcon}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Matériels Affectés"
              value={affectes}
              icon={AffectIcon}
              color="success"
              subtitle={`${tauxAffectation}% du total`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Matériels Libres"
              value={libres}
              icon={StockIcon}
              color="info"
              subtitle="Disponibles en stock"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="En Panne"
              value={enPanne}
              icon={ErrorIcon}
              color="error"
              subtitle="Nécessitent attention"
            />
          </Grid>
        </Grid>

        {/* Statistiques secondaires */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Agents"
              value={data?.statistics.agents || 0}
              icon={PeopleIcon}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Bureaux"
              value={data?.statistics.bureaux || 0}
              icon={BusinessIcon}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Catégories"
              value={categories}
              icon={CategoryIcon}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatsCard
              title="Disponibilité"
              value={`${tauxDisponibilite}%`}
              icon={CheckCircleIcon}
              color="primary"
              subtitle={`${enService + enStock} opérationnels`}
            />
          </Grid>
        </Grid>

        {/* Alertes */}
        {enPanne > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="medium">
              ⚠️ Attention: {enPanne} matériel(s) en panne nécessite(nt) votre attention
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Derniers mouvements */}
          <Grid item xs={12} md={6}>
            <RecentMovementsCard />
          </Grid>

          {/* Matériels par catégorie */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Matériels par Catégorie"
                subheader="Répartition par type"
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
                                variant="outlined"
                                size="small"
                              />
                            </Tooltip>
                          </Box>
                          <LinearProgress variant="determinate" value={progress} />
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
          </Grid>

          {/* Statut des matériels - Vue d'ensemble */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Répartition par Statut"
                subheader="État actuel de tous les matériels"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'success.light', borderRadius: 1 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {data?.statistics.materiels.enService || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En Service
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'error.light', borderRadius: 1 }}>
                      <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="error.main" fontWeight="bold">
                        {data?.statistics.materiels.enPanne || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En Panne
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'warning.light', borderRadius: 1 }}>
                      <BuildIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="warning.main" fontWeight="bold">
                        {data?.statistics.materiels.enMaintenance || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En Maintenance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'info.light', borderRadius: 1 }}>
                      <StockIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        {data?.statistics.materiels.enStock || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En Stock
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
