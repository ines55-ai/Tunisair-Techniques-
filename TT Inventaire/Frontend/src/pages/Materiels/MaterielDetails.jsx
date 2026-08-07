import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  AssignmentInd as AffectIcon,
  SwapHoriz as TransferIcon,
  Error as PanneIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { materielService } from '../../services/materielService';
import { mouvementService } from '../../services/mouvementService';
import MaterielForm from '../../components/materiels/MaterielForm';
import AffectationDialog from '../../components/materiels/AffectationDialog';
import TransfertDialog from '../../components/materiels/TransfertDialog';
import PanneDialog from '../../components/materiels/PanneDialog';
import HistoriqueTimeline from '../../components/materiels/HistoriqueTimeline';

const statutColors = {
  EN_SERVICE: 'success',
  EN_PANNE: 'error',
  EN_MAINTENANCE: 'warning',
  EN_STOCK: 'info',
  REFORME: 'default',
  PERDU: 'error',
};

const statutLabels = {
  EN_SERVICE: 'En Service',
  EN_PANNE: 'En Panne',
  EN_MAINTENANCE: 'En Maintenance',
  EN_STOCK: 'En Stock',
  REFORME: 'Réformé',
  PERDU: 'Perdu',
};

function MaterielDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [materiel, setMateriel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [affectationDialogOpen, setAffectationDialogOpen] = useState(false);
  const [transfertDialogOpen, setTransfertDialogOpen] = useState(false);
  const [panneDialogOpen, setPanneDialogOpen] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMateriel();
  }, [id]);

  const fetchMateriel = async () => {
    try {
      setLoading(true);
      const data = await materielService.getById(id);
      setMateriel(data);
    } catch (error) {
      console.error('Erreur lors du chargement du matériel:', error);
      showSnackbar('Erreur lors du chargement du matériel', 'error');
      navigate('/materiels');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditSubmit = async (data) => {
    try {
      setSubmitting(true);
      await materielService.update(id, data);
      showSnackbar('Matériel modifié avec succès', 'success');
      setEditDialogOpen(false);
      fetchMateriel();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Erreur lors de la modification', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAffectationSubmit = async (data) => {
    try {
      setSubmitting(true);
      await mouvementService.create(data);
      await materielService.update(id, {
        agentId: data.agentDestId,
        bureauId: data.bureauId,
        statut: 'EN_SERVICE',
      });
      showSnackbar('Matériel affecté avec succès', 'success');
      setAffectationDialogOpen(false);
      fetchMateriel();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Erreur lors de l\'affectation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfertSubmit = async (data) => {
    try {
      setSubmitting(true);
      await mouvementService.create(data);
      await materielService.update(id, {
        agentId: data.agentDestId,
        bureauId: data.nouveauBureauId,
      });
      showSnackbar('Matériel transféré avec succès', 'success');
      setTransfertDialogOpen(false);
      fetchMateriel();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Erreur lors du transfert', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePanneSubmit = async (data) => {
    try {
      setSubmitting(true);
      // 1. Créer la note de panne (à implémenter côté backend)
      // await panneService.create(data);
      
      // 2. Changer le statut du matériel à EN_PANNE
      await materielService.update(id, { statut: 'EN_PANNE' });
      
      showSnackbar('Panne déclarée avec succès', 'success');
      setPanneDialogOpen(false);
      fetchMateriel();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Erreur lors de la déclaration', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  if (!materiel) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Matériel introuvable
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/materiels')} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1">
              {materiel.nom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              N° Série: {materiel.numeroSerie}
              {materiel.numeroInventaire && ` • N° Inventaire: ${materiel.numeroInventaire}`}
            </Typography>
          </Box>
          <Chip
            label={statutLabels[materiel.statut]}
            color={statutColors[materiel.statut]}
            size="large"
          />
        </Box>

        {/* Boutons d'action */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            Modifier
          </Button>
          <Button
            variant="contained"
            startIcon={<AffectIcon />}
            onClick={() => setAffectationDialogOpen(true)}
            disabled={materiel.agentId && materiel.statut !== 'EN_STOCK'}
          >
            Affecter
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<TransferIcon />}
            onClick={() => setTransfertDialogOpen(true)}
            disabled={!materiel.agentId}
          >
            Transférer
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PanneIcon />}
            onClick={() => setPanneDialogOpen(true)}
            disabled={materiel.statut === 'EN_PANNE'}
          >
            Déclarer une Panne
          </Button>
        </Box>

        {/* Onglets */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Informations" />
            <Tab label="Historique" icon={<HistoryIcon />} iconPosition="start" />
            <Tab label="Pannes" />
          </Tabs>
        </Paper>

        {/* Contenu des onglets */}
        {currentTab === 0 && (
          <Grid container spacing={3}>
            {/* Informations générales */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations Générales
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Marque
                    </Typography>
                    <Typography variant="body1">
                      {materiel.marque || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Modèle
                    </Typography>
                    <Typography variant="body1">
                      {materiel.modele || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Catégorie
                    </Typography>
                    <Typography variant="body1">
                      {materiel.categorie?.nom || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date d'Acquisition
                    </Typography>
                    <Typography variant="body1">
                      {materiel.dateAcquisition
                        ? new Date(materiel.dateAcquisition).toLocaleDateString('fr-FR')
                        : '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Garantie Expire
                    </Typography>
                    <Typography variant="body1">
                      {materiel.garantieExpire
                        ? new Date(materiel.garantieExpire).toLocaleDateString('fr-FR')
                        : '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Valeur
                    </Typography>
                    <Typography variant="body1">
                      {materiel.valeur ? `${materiel.valeur} DT` : '-'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Affectation actuelle */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Affectation Actuelle
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Agent
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {materiel.agent
                        ? `${materiel.agent.nom} ${materiel.agent.prenom}`
                        : 'Non affecté'}
                    </Typography>
                    {materiel.agent?.matricule && (
                      <Typography variant="caption" color="text.secondary">
                        Matricule: {materiel.agent.matricule}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Bureau
                    </Typography>
                    <Typography variant="body1">
                      {materiel.bureau ? materiel.bureau.nom : 'Non défini'}
                    </Typography>
                    {materiel.bureau?.code && (
                      <Typography variant="caption" color="text.secondary">
                        Code: {materiel.bureau.code}
                      </Typography>
                    )}
                  </Box>

                  {materiel.description && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {materiel.description}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && <HistoriqueTimeline materielId={materiel.id} />}

        {currentTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Historique des Pannes
            </Typography>
            <Alert severity="info">
              Fonctionnalité en cours d'implémentation
            </Alert>
          </Paper>
        )}
      </Box>

      {/* Dialogs */}
      <MaterielForm
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        materiel={materiel}
        loading={submitting}
      />

      <AffectationDialog
        open={affectationDialogOpen}
        onClose={() => setAffectationDialogOpen(false)}
        onSubmit={handleAffectationSubmit}
        materiel={materiel}
        loading={submitting}
      />

      <TransfertDialog
        open={transfertDialogOpen}
        onClose={() => setTransfertDialogOpen(false)}
        onSubmit={handleTransfertSubmit}
        materiel={materiel}
        loading={submitting}
      />

      <PanneDialog
        open={panneDialogOpen}
        onClose={() => setPanneDialogOpen(false)}
        onSubmit={handlePanneSubmit}
        materiel={materiel}
        loading={submitting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MaterielDetails;
