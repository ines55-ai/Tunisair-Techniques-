import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AssignmentInd as AffectIcon,
  SwapHoriz as TransferIcon,
  QrCode as QrCodeIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { materielService } from '../../services/materielService';
import { mouvementService } from '../../services/mouvementService';
import { barcodeService } from '../../services/barcodeService';
import MaterielForm from '../../components/materiels/MaterielForm';
import AffectationDialog from '../../components/materiels/AffectationDialog';
import TransfertDialog from '../../components/materiels/TransfertDialog';
import { extractPaginatedData } from '../../utils/pagination';

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

function Materiels() {
  const navigate = useNavigate();
  const [materiels, setMateriels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materielToDelete, setMaterielToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Nouveaux dialogs
  const [affectationDialogOpen, setAffectationDialogOpen] = useState(false);
  const [transfertDialogOpen, setTransfertDialogOpen] = useState(false);
  const [materielForAction, setMaterielForAction] = useState(null);

  useEffect(() => {
    fetchMateriels();
  }, [page, rowsPerPage, search]);

  const fetchMateriels = async () => {
    try {
      setLoading(true);
      const response = await materielService.getAll(page + 1, rowsPerPage, search);
      const { data, total } = extractPaginatedData(response);
      setMateriels(data);
      setTotalCount(total);
    } catch (error) {
      console.error('Erreur lors du chargement des matériels:', error);
      setMateriels([]);
      setTotalCount(0);
      showSnackbar('Erreur lors du chargement des matériels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleAddClick = () => {
    setSelectedMateriel(null);
    setFormOpen(true);
  };

  const handleEditClick = (materiel) => {
    setSelectedMateriel(materiel);
    setFormOpen(true);
  };

  const handleDeleteClick = (materiel) => {
    setMaterielToDelete(materiel);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (selectedMateriel) {
        await materielService.update(selectedMateriel.id, data);
        showSnackbar('Matériel modifié avec succès', 'success');
      } else {
        await materielService.create(data);
        showSnackbar('Matériel ajouté avec succès', 'success');
      }
      setFormOpen(false);
      fetchMateriels();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de l\'enregistrement',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await materielService.delete(materielToDelete.id);
      showSnackbar('Matériel supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      fetchMateriels();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la suppression',
        'error'
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewClick = (materiel) => {
    navigate(`/materiels/${materiel.id}`);
  };

  const handleAffectClick = (materiel) => {
    setMaterielForAction(materiel);
    setAffectationDialogOpen(true);
  };

  const handleTransferClick = (materiel) => {
    setMaterielForAction(materiel);
    setTransfertDialogOpen(true);
  };

  const handleDownloadLabel = async (materiel) => {
    try {
      await barcodeService.downloadLabel(materiel.id);
      showSnackbar('Étiquette téléchargée avec succès', 'success');
    } catch (error) {
      showSnackbar('Erreur lors du téléchargement de l\'étiquette', 'error');
    }
  };

  const handleAffectationSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Extraire bureauId pour mise à jour matériel
      const { bureauId, ...mouvementData } = data;
      
      // 1. Créer le mouvement
      await mouvementService.create(mouvementData);
      
      // 2. Mettre à jour le matériel avec le bureau
      if (bureauId) {
        await materielService.update(materielForAction.id, {
          agentId: data.agentDestId,
          bureauId: bureauId,
        });
      }
      
      showSnackbar('Matériel affecté avec succès', 'success');
      setAffectationDialogOpen(false);
      fetchMateriels();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de l\'affectation',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfertSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Extraire bureauId pour mise à jour matériel
      const { nouveauBureauId, ...mouvementData } = data;
      
      // 1. Créer le mouvement
      await mouvementService.create(mouvementData);
      
      // 2. Mettre à jour le matériel avec le nouveau bureau
      if (nouveauBureauId) {
        await materielService.update(materielForAction.id, {
          agentId: data.agentDestId,
          bureauId: nouveauBureauId,
        });
      }
      
      showSnackbar('Matériel transféré avec succès', 'success');
      setTransfertDialogOpen(false);
      fetchMateriels();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors du transfert',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des Matériels
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Ajouter un Matériel
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, numéro de série, marque..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Série</TableCell>
                <TableCell>N° Inventaire</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Marque</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : materiels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun matériel trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                materiels.map((materiel) => (
                  <TableRow key={materiel.id} hover>
                    <TableCell>{materiel.numeroSerie}</TableCell>
                    <TableCell>{materiel.numeroInventaire || '-'}</TableCell>
                    <TableCell>{materiel.nom}</TableCell>
                    <TableCell>{materiel.marque || '-'}</TableCell>
                    <TableCell>{materiel.categorie?.nom}</TableCell>
                    <TableCell>
                      <Chip
                        label={statutLabels[materiel.statut]}
                        color={statutColors[materiel.statut]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {materiel.agent
                        ? `${materiel.agent.nom} ${materiel.agent.prenom}`
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
                        <IconButton size="small" color="info" onClick={() => handleViewClick(materiel)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger étiquette">
                        <IconButton size="small" color="secondary" onClick={() => handleDownloadLabel(materiel)}>
                          <QrCodeIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton size="small" color="primary" onClick={() => handleEditClick(materiel)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Affecter">
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleAffectClick(materiel)}
                          disabled={materiel.agentId && materiel.statut !== 'EN_STOCK'}
                        >
                          <AffectIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Transférer">
                        <IconButton 
                          size="small" 
                          color="warning" 
                          onClick={() => handleTransferClick(materiel)}
                          disabled={!materiel.agentId}
                        >
                          <TransferIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(materiel)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} sur ${count}`
            }
          />
        </TableContainer>
      </Box>

      <MaterielForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        materiel={selectedMateriel}
        loading={submitting}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le matériel "{materielToDelete?.nom}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <AffectationDialog
        open={affectationDialogOpen}
        onClose={() => setAffectationDialogOpen(false)}
        onSubmit={handleAffectationSubmit}
        materiel={materielForAction}
        loading={submitting}
      />

      <TransfertDialog
        open={transfertDialogOpen}
        onClose={() => setTransfertDialogOpen(false)}
        onSubmit={handleTransfertSubmit}
        materiel={materielForAction}
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

export default Materiels;
