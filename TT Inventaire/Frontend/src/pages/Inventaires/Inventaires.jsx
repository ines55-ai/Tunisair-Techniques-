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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import inventaireService from '../../services/inventaireService';
import InventaireForm from '../../components/inventaires/InventaireForm';

const Inventaires = () => {
  const navigate = useNavigate();
  const [inventaires, setInventaires] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedInventaire, setSelectedInventaire] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [inventaireToDelete, setInventaireToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadInventaires();
    loadStatistiques();
  }, []);

  const loadInventaires = async () => {
    try {
      const data = await inventaireService.getAll();
      setInventaires(data);
    } catch (error) {
      console.error('Erreur lors du chargement des inventaires:', error);
      showSnackbar('Erreur lors du chargement des inventaires', 'error');
    }
  };

  const loadStatistiques = async () => {
    try {
      const data = await inventaireService.getStatistiques();
      setStatistiques(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleCreate = () => {
    setSelectedInventaire(null);
    setOpenForm(true);
  };

  const handleEdit = (inventaire) => {
    setSelectedInventaire(inventaire);
    setOpenForm(true);
  };

  const handleDelete = (inventaire) => {
    setInventaireToDelete(inventaire);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await inventaireService.delete(inventaireToDelete.id);
      showSnackbar('Inventaire supprimé avec succès', 'success');
      loadInventaires();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showSnackbar('Erreur lors de la suppression de l\'inventaire', 'error');
    } finally {
      setOpenDeleteDialog(false);
      setInventaireToDelete(null);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedInventaire) {
        await inventaireService.update(selectedInventaire.id, data);
        showSnackbar('Inventaire modifié avec succès', 'success');
      } else {
        await inventaireService.create(data);
        showSnackbar('Inventaire créé avec succès', 'success');
      }
      setOpenForm(false);
      loadInventaires();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showSnackbar('Erreur lors de la soumission', 'error');
    }
  };

  const handleCloturer = async (id) => {
    try {
      await inventaireService.cloturer(id);
      showSnackbar('Inventaire clôturé avec succès', 'success');
      loadInventaires();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur lors de la clôture:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de la clôture', 'error');
    }
  };

  const handleValider = async (id) => {
    try {
      await inventaireService.valider(id);
      showSnackbar('Inventaire validé avec succès', 'success');
      loadInventaires();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de la validation', 'error');
    }
  };

  const handleAnnuler = async (id) => {
    try {
      await inventaireService.annuler(id);
      showSnackbar('Inventaire annulé avec succès', 'success');
      loadInventaires();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      showSnackbar('Erreur lors de l\'annulation', 'error');
    }
  };

  const handleView = (id) => {
    navigate(`/inventaires/${id}`);
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

  const getPerimetreLabel = (type) => {
    const labels = {
      TOUS: 'Tous les matériels',
      CATEGORIE: 'Par catégorie',
      BUREAU: 'Par bureau',
      AGENT: 'Par agent',
      STATUT: 'Par statut',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Inventaires</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Créer un inventaire
        </Button>
      </Box>

      {statistiques && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Inventaires
                </Typography>
                <Typography variant="h4">{statistiques.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom>
                  En cours
                </Typography>
                <Typography variant="h4">{statistiques.enCours}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom>
                  Terminés
                </Typography>
                <Typography variant="h4">{statistiques.termines}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom>
                  Validés
                </Typography>
                <Typography variant="h4">{statistiques.valides}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Référence</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date fin</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Périmètre</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Progression</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventaires.map((inventaire) => (
              <TableRow key={inventaire.id}>
                <TableCell>{inventaire.reference}</TableCell>
                <TableCell>{inventaire.titre}</TableCell>
                <TableCell>{formatDate(inventaire.dateDebut)}</TableCell>
                <TableCell>{formatDate(inventaire.dateFin)}</TableCell>
                <TableCell>{inventaire.responsable}</TableCell>
                <TableCell>{getPerimetreLabel(inventaire.perimetreType)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatutLabel(inventaire.statut)}
                    color={getStatutColor(inventaire.statut)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {inventaire.lignes && inventaire.lignes.length > 0 ? (
                    `${Math.round((inventaire.lignes.filter(l => l.trouve).length / inventaire.lignes.length) * 100)}%`
                  ) : '0%'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleView(inventaire.id)}
                    title="Voir détails"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {inventaire.statut === 'EN_COURS' && (
                    <>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(inventaire)}
                        title="Modifier"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleCloturer(inventaire.id)}
                        title="Clôturer"
                      >
                        <AssignmentTurnedInIcon />
                      </IconButton>
                    </>
                  )}
                  {inventaire.statut === 'TERMINE' && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleValider(inventaire.id)}
                      title="Valider"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  {(inventaire.statut === 'EN_COURS' || inventaire.statut === 'TERMINE') && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleAnnuler(inventaire.id)}
                      title="Annuler"
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                  {inventaire.statut === 'EN_COURS' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(inventaire)}
                      title="Supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InventaireForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        inventaire={selectedInventaire}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet inventaire ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

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

export default Inventaires;
