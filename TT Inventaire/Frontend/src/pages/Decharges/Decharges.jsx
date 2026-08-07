import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
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
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { dechargeService } from '../../services/dechargeService';
import { extractPaginatedData } from '../../utils/pagination';

function Decharges() {
  const [decharges, setDecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dechargeToDelete, setDechargeToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchDecharges();
  }, [page, rowsPerPage, search]);

  const fetchDecharges = async () => {
    try {
      setLoading(true);
      const response = await dechargeService.getAll(page + 1, rowsPerPage, search);
      const { data, total } = extractPaginatedData(response);
      setDecharges(data);
      setTotalCount(total);
    } catch (error) {
      console.error('Erreur lors du chargement des décharges:', error);
      setDecharges([]);
      setTotalCount(0);
      showSnackbar('Erreur lors du chargement des décharges', 'error');
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

  const handleDeleteClick = (decharge) => {
    setDechargeToDelete(decharge);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dechargeService.delete(dechargeToDelete.id);
      showSnackbar('Décharge supprimée avec succès', 'success');
      setDeleteDialogOpen(false);
      fetchDecharges();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la suppression',
        'error'
      );
    }
  };

  const handleDownload = async (decharge) => {
    try {
      setDownloading(decharge.id);
      const blob = await dechargeService.download(decharge.id);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `decharge_${decharge.numeroDocument}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showSnackbar('Décharge téléchargée avec succès', 'success');
    } catch (error) {
      showSnackbar('Erreur lors du téléchargement', 'error');
    } finally {
      setDownloading(null);
    }
  };

  const handleView = async (decharge) => {
    try {
      await dechargeService.view(decharge.id);
    } catch (error) {
      showSnackbar('Erreur lors de la visualisation', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      AFFECTATION: 'Affectation',
      TRANSFERT: 'Transfert',
      RETOUR: 'Retour',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      AFFECTATION: 'primary',
      TRANSFERT: 'info',
      RETOUR: 'success',
    };
    return colors[type] || 'default';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1">
              Gestion des Décharges
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Visualisez et téléchargez les décharges de matériel
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PdfIcon color="error" sx={{ fontSize: 40 }} />
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro, matériel, agent..."
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
                <TableCell>N° Document</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Matériel</TableCell>
                <TableCell>Ancien Agent</TableCell>
                <TableCell>Nouvel Agent</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : decharges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucune décharge trouvée
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                decharges.map((decharge) => (
                  <TableRow key={decharge.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PdfIcon color="error" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                          {decharge.numeroDocument}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(decharge.dateGeneration)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(decharge.typeMouvement)}
                        color={getTypeColor(decharge.typeMouvement)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {decharge.materiel?.nom || '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {decharge.materiel?.numeroSerie || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {decharge.ancienAgent
                        ? `${decharge.ancienAgent.nom} ${decharge.ancienAgent.prenom}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {decharge.nouvelAgent
                        ? `${decharge.nouvelAgent.nom} ${decharge.nouvelAgent.prenom}`
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Visualiser">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleView(decharge)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownload(decharge)}
                          disabled={downloading === decharge.id}
                        >
                          {downloading === decharge.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DownloadIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(decharge)}
                        >
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
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </TableContainer>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette décharge ?
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

export default Decharges;
