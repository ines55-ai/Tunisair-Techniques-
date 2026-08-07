import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Report as ReportIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import inventaireService from '../../services/inventaireService';

const InventaireDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inventaire, setInventaire] = useState(null);
  const [ecarts, setEcarts] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editingLigne, setEditingLigne] = useState(null);
  const [remarqueEdit, setRemarqueEdit] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadInventaire();
    loadEcarts();
  }, [id]);

  const loadInventaire = async () => {
    try {
      const data = await inventaireService.getById(id);
      setInventaire(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'inventaire:', error);
      showSnackbar('Erreur lors du chargement de l\'inventaire', 'error');
    }
  };

  const loadEcarts = async () => {
    try {
      const data = await inventaireService.getEcarts(id);
      setEcarts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des écarts:', error);
    }
  };

  const handleMarquerTrouve = async (ligneId) => {
    try {
      await inventaireService.marquerTrouve(id, ligneId);
      showSnackbar('Matériel marqué comme trouvé', 'success');
      loadInventaire();
      loadEcarts();
    } catch (error) {
      console.error('Erreur:', error);
      showSnackbar('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleEditRemarque = (ligne) => {
    setEditingLigne(ligne.id);
    setRemarqueEdit(ligne.remarques || '');
  };

  const handleSaveRemarque = async (ligneId) => {
    try {
      await inventaireService.updateLigne(id, ligneId, { remarques: remarqueEdit });
      showSnackbar('Remarque enregistrée', 'success');
      setEditingLigne(null);
      loadInventaire();
    } catch (error) {
      console.error('Erreur:', error);
      showSnackbar('Erreur lors de la mise à jour', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatutColor = (statut) => {
    const colors = {
      EN_COURS: 'primary',
      TERMINE: 'info',
      VALIDE: 'success',
      ANNULE: 'error',
    };
    return colors[statut] || 'default';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      EN_COURS: 'En cours',
      TERMINE: 'Terminé',
      VALIDE: 'Validé',
      ANNULE: 'Annulé',
    };
    return labels[statut] || statut;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (!inventaire) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  const progression = inventaire.lignes && inventaire.lignes.length > 0
    ? Math.round((inventaire.lignes.filter(l => l.trouve).length / inventaire.lignes.length) * 100)
    : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/inventaires')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Inventaire: {inventaire.reference}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Informations générales</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">Titre:</Typography>
                  <Typography>{inventaire.titre}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Référence:</Typography>
                  <Typography>{inventaire.reference}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Responsable:</Typography>
                  <Typography>{inventaire.responsable}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Statut:</Typography>
                  <Chip
                    label={getStatutLabel(inventaire.statut)}
                    color={getStatutColor(inventaire.statut)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Date de début:</Typography>
                  <Typography>{formatDate(inventaire.dateDebut)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Date de fin:</Typography>
                  <Typography>{formatDate(inventaire.dateFin)}</Typography>
                </Box>
                {inventaire.remarques && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">Remarques:</Typography>
                    <Typography>{inventaire.remarques}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Statistiques</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">Progression:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 20, borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ bgcolor: 'success.main', height: '100%', width: `${progression}%` }} />
                    </Box>
                    <Typography variant="h6">{progression}%</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Matériels trouvés:</Typography>
                  <Typography variant="h6">
                    {inventaire.lignes.filter(l => l.trouve).length} / {inventaire.lignes.length}
                  </Typography>
                </Box>
                {ecarts && (
                  <>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Matériels manquants:</Typography>
                      <Typography variant="h6" color="error">{ecarts.manquants.length}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Matériels en surplus:</Typography>
                      <Typography variant="h6" color="warning.main">{ecarts.surplus.length}</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Lignes d'inventaire" />
          <Tab label="Écarts" icon={<ReportIcon />} iconPosition="end" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Série</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Marque</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Statut attendu</TableCell>
                <TableCell>Trouvé</TableCell>
                <TableCell>Date vérification</TableCell>
                <TableCell>Remarques</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventaire.lignes.map((ligne) => (
                <TableRow key={ligne.id} sx={{ bgcolor: ligne.trouve ? 'success.light' : 'inherit' }}>
                  <TableCell>{ligne.materiel.numeroSerie}</TableCell>
                  <TableCell>{ligne.materiel.nom}</TableCell>
                  <TableCell>{ligne.materiel.marque}</TableCell>
                  <TableCell>{ligne.materiel.categorie.nom}</TableCell>
                  <TableCell>{ligne.statutAttendu}</TableCell>
                  <TableCell>{ligne.trouve ? 'Oui' : 'Non'}
                  </TableCell>
                  <TableCell>{formatDateTime(ligne.dateVerif)}</TableCell>
                  <TableCell>
                    {editingLigne === ligne.id ? (
                      <TextField
                        size="small"
                        fullWidth
                        value={remarqueEdit}
                        onChange={(e) => setRemarqueEdit(e.target.value)}
                        multiline
                        rows={2}
                      />
                    ) : (
                      ligne.remarques || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {inventaire.statut === 'EN_COURS' && (
                      <>
                        {!ligne.trouve && (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleMarquerTrouve(ligne.id)}
                            title="Marquer comme trouvé"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        )}
                        {editingLigne === ligne.id ? (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSaveRemarque(ligne.id)}
                            title="Enregistrer"
                          >
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditRemarque(ligne)}
                            title="Modifier remarque"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && ecarts && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="error">
                Matériels manquants ({ecarts.manquants.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>N° Série</TableCell>
                      <TableCell>Nom</TableCell>
                      <TableCell>Marque</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ecarts.manquants.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.materiel.numeroSerie}</TableCell>
                        <TableCell>{item.materiel.nom}</TableCell>
                        <TableCell>{item.materiel.marque}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="warning.main">
                Matériels en surplus ({ecarts.surplus.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>N° Série</TableCell>
                      <TableCell>Nom</TableCell>
                      <TableCell>Marque</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ecarts.surplus.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.numeroSerie}</TableCell>
                        <TableCell>{item.nom}</TableCell>
                        <TableCell>{item.marque}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventaireDetails;
