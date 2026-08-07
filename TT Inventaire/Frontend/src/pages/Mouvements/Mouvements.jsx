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
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { mouvementService } from '../../services/mouvementService';
import MouvementForm from '../../components/mouvements/MouvementForm';
import { extractPaginatedData } from '../../utils/pagination';

const typeMouvementColors = {
  AFFECTATION: 'success',
  RETOUR: 'warning',
  TRANSFERT: 'info',
  MAINTENANCE: 'secondary',
  REFORME: 'error',
};

const typeMouvementLabels = {
  AFFECTATION: 'Affectation',
  RETOUR: 'Retour',
  TRANSFERT: 'Transfert',
  MAINTENANCE: 'Maintenance',
  REFORME: 'Réforme',
};

function Mouvements() {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    typeMouvement: '',
    enCours: '',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [clotureDialogOpen, setClotureDialogOpen] = useState(false);
  const [mouvementToCloture, setMouvementToCloture] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMouvements();
  }, [page, rowsPerPage, filters]);

  const fetchMouvements = async () => {
    try {
      setLoading(true);
      const response = await mouvementService.getAll(
        page + 1,
        rowsPerPage,
        filters
      );
      const { data, total } = extractPaginatedData(response);
      setMouvements(data);
      setTotalCount(total);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
      setMouvements([]);
      setTotalCount(0);
      showSnackbar('Erreur lors du chargement des mouvements', 'error');
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const handleAddClick = () => {
    setFormOpen(true);
  };

  const handleClotureClick = (mouvement) => {
    setMouvementToCloture(mouvement);
    setClotureDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitting(true);
      await mouvementService.create(data);
      showSnackbar('Mouvement créé avec succès', 'success');
      setFormOpen(false);
      fetchMouvements();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la création',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCloture = async () => {
    try {
      await mouvementService.cloturer(mouvementToCloture.id);
      showSnackbar('Mouvement clôturé avec succès', 'success');
      setClotureDialogOpen(false);
      fetchMouvements();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la clôture',
        'error'
      );
    }
  };

  const handleDownloadPDF = async (mouvement) => {
    try {
      await mouvementService.downloadPDF(mouvement.id);
      showSnackbar('PDF téléchargé avec succès', 'success');
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors du téléchargement',
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des Mouvements
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Nouveau Mouvement
          </Button>
        </Box>

        {/* Filtres */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Type de mouvement"
                name="typeMouvement"
                value={filters.typeMouvement}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Tous</MenuItem>
                {Object.entries(typeMouvementLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Statut"
                name="enCours"
                value={filters.enCours}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="true">En cours</MenuItem>
                <MenuItem value="false">Terminés</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Tableau */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Matériel</TableCell>
                <TableCell>Agent Source</TableCell>
                <TableCell>Agent Dest.</TableCell>
                <TableCell>Motif</TableCell>
                <TableCell>Statut</TableCell>
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
              ) : mouvements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun mouvement trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                mouvements.map((mouvement) => (
                  <TableRow key={mouvement.id} hover>
                    <TableCell>
                      {new Date(mouvement.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={typeMouvementLabels[mouvement.typeMouvement]}
                        color={typeMouvementColors[mouvement.typeMouvement]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {mouvement.materiel?.numeroSerie}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {mouvement.materiel?.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {mouvement.agentSource
                        ? `${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {mouvement.agentDestId
                        ? (mouvement.agentDest
                            ? `${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`
                            : '-')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {mouvement.description ? (
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {mouvement.description}
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {mouvement.cloture ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Terminé"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          icon={<CancelIcon />}
                          label="En cours"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDownloadPDF(mouvement)}
                        title="Télécharger PDF"
                      >
                        <PdfIcon />
                      </IconButton>
                      {!mouvement.cloture && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleClotureClick(mouvement)}
                          sx={{ ml: 1 }}
                        >
                          Clôturer
                        </Button>
                      )}
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

      <MouvementForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        loading={submitting}
      />

      <Dialog open={clotureDialogOpen} onClose={() => setClotureDialogOpen(false)}>
        <DialogTitle>Confirmer la clôture</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir clôturer ce mouvement?
            {mouvementToCloture && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Type:</strong> {typeMouvementLabels[mouvementToCloture.typeMouvement]}
                </Typography>
                <Typography variant="body2">
                  <strong>Matériel:</strong> {mouvementToCloture.materiel?.nom}
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClotureDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmCloture} color="primary" variant="contained">
            Clôturer
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

export default Mouvements;
