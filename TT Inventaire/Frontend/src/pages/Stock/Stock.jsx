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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { stockService } from '../../services/stockService';
import StockForm from '../../components/stock/StockForm';

const etatColors = {
  DISPONIBLE: 'success',
  RESERVE: 'warning',
  EN_COMMANDE: 'info',
  ENDOMMAGE: 'error',
};

const etatLabels = {
  DISPONIBLE: 'Disponible',
  RESERVE: 'Réservé',
  EN_COMMANDE: 'En Commande',
  ENDOMMAGE: 'Endommagé',
};

function Stock() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchStocks();
    fetchStatistics();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await stockService.getAll();
      setStocks(data);
    } catch (error) {
      showSnackbar('Erreur lors du chargement du stock', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await stockService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleAddClick = () => {
    setSelectedStock(null);
    setFormOpen(true);
  };

  const handleEditClick = (stock) => {
    setSelectedStock(stock);
    setFormOpen(true);
  };

  const handleDeleteClick = (stock) => {
    setStockToDelete(stock);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (selectedStock) {
        await stockService.update(selectedStock.id, data);
        showSnackbar('Entrée stock modifiée avec succès', 'success');
      } else {
        await stockService.create(data);
        showSnackbar('Matériel ajouté au stock avec succès', 'success');
      }
      setFormOpen(false);
      fetchStocks();
      fetchStatistics();
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
      await stockService.delete(stockToDelete.id);
      showSnackbar('Entrée stock supprimée avec succès', 'success');
      setDeleteDialogOpen(false);
      fetchStocks();
      fetchStatistics();
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

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.materiel?.numeroSerie.toLowerCase().includes(search.toLowerCase()) ||
      stock.materiel?.nom.toLowerCase().includes(search.toLowerCase()) ||
      stock.emplacement?.toLowerCase().includes(search.toLowerCase()) ||
      stock.materiel?.categorie?.nom.toLowerCase().includes(search.toLowerCase())
  );

  const isAlerte = (stock) => {
    return stock.seuilAlerte && stock.quantite < stock.seuilAlerte;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* En-tête */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion du Stock
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Ajouter au Stock
          </Button>
        </Box>

        {/* Statistiques */}
        {statistics && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        Total Stock
                      </Typography>
                      <Typography variant="h4">{statistics.total}</Typography>
                    </Box>
                    <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        Disponibles
                      </Typography>
                      <Typography variant="h4">
                        {statistics.parEtat?.DISPONIBLE || 0}
                      </Typography>
                    </Box>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        Alertes Stock
                      </Typography>
                      <Typography variant="h4" color="error">
                        {statistics.alertes}
                      </Typography>
                    </Box>
                    <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        Arrivages (30j)
                      </Typography>
                      <Typography variant="h4">
                        {statistics.arrivagesRecents?.length || 0}
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Barre de recherche */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro de série, nom, catégorie ou emplacement..."
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

        {/* Tableau */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Série</TableCell>
                <TableCell>Matériel</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Date Arrivage</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Seuil</TableCell>
                <TableCell>Emplacement</TableCell>
                <TableCell>État</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun matériel en stock
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStocks.map((stock) => (
                  <TableRow
                    key={stock.id}
                    hover
                    sx={{
                      backgroundColor: isAlerte(stock) ? 'rgba(211, 47, 47, 0.05)' : 'inherit',
                    }}
                  >
                    <TableCell>{stock.materiel?.numeroSerie}</TableCell>
                    <TableCell>{stock.materiel?.nom}</TableCell>
                    <TableCell>{stock.materiel?.categorie?.nom}</TableCell>
                    <TableCell>
                      {new Date(stock.dateArrivage).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{stock.quantite}</Typography>
                        {isAlerte(stock) && (
                          <WarningIcon color="error" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{stock.seuilAlerte || '-'}</TableCell>
                    <TableCell>{stock.emplacement || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={etatLabels[stock.etat]}
                        color={etatColors[stock.etat]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEditClick(stock)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(stock)}>
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

      <StockForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        stock={selectedStock}
        loading={submitting}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette entrée stock pour "{stockToDelete?.materiel?.nom}" ?
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

export default Stock;
