import { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { bureauService } from '../../services/bureauService';
import BureauForm from '../../components/bureaux/BureauForm';

function Bureaux() {
  const [bureaux, setBureaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBureau, setSelectedBureau] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bureauToDelete, setBureauToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBureaux();
  }, []);

  const fetchBureaux = async () => {
    try {
      setLoading(true);
      const data = await bureauService.getAll();
      setBureaux(data);
    } catch (error) {
      showSnackbar('Erreur lors du chargement des bureaux', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleAddClick = () => {
    setSelectedBureau(null);
    setFormOpen(true);
  };

  const handleEditClick = (bureau) => {
    setSelectedBureau(bureau);
    setFormOpen(true);
  };

  const handleDeleteClick = (bureau) => {
    setBureauToDelete(bureau);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (selectedBureau) {
        await bureauService.update(selectedBureau.id, data);
        showSnackbar('Bureau modifié avec succès', 'success');
      } else {
        await bureauService.create(data);
        showSnackbar('Bureau ajouté avec succès', 'success');
      }
      setFormOpen(false);
      fetchBureaux();
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
      await bureauService.delete(bureauToDelete.id);
      showSnackbar('Bureau supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      fetchBureaux();
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

  const filteredBureaux = bureaux.filter(
    (bureau) =>
      bureau.code.toLowerCase().includes(search.toLowerCase()) ||
      bureau.nom.toLowerCase().includes(search.toLowerCase()) ||
      (bureau.etage && bureau.etage.toLowerCase().includes(search.toLowerCase())) ||
      (bureau.batiment && bureau.batiment.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des Bureaux
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Ajouter un Bureau
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par code, nom, étage ou bâtiment..."
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
                <TableCell>Code</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Étage</TableCell>
                <TableCell>Bâtiment</TableCell>
                <TableCell>Capacité</TableCell>
                <TableCell>Agents</TableCell>
                <TableCell>Matériels</TableCell>
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
              ) : filteredBureaux.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun bureau trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBureaux.map((bureau) => (
                  <TableRow key={bureau.id} hover>
                    <TableCell>
                      <Chip label={bureau.code} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{bureau.nom}</TableCell>
                    <TableCell>{bureau.etage || '-'}</TableCell>
                    <TableCell>{bureau.batiment || '-'}</TableCell>
                    <TableCell>{bureau.capacite || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={bureau._count?.agents || 0}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bureau._count?.materiels || 0}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEditClick(bureau)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(bureau)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <BureauForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        bureau={selectedBureau}
        loading={submitting}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le bureau "{bureauToDelete?.code} - {bureauToDelete?.nom}" ?
            {(bureauToDelete?._count?.agents > 0 || bureauToDelete?._count?.materiels > 0) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Ce bureau a {bureauToDelete._count.agents} agent(s) et {bureauToDelete._count.materiels} matériel(s) assigné(s).
              </Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

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

export default Bureaux;
