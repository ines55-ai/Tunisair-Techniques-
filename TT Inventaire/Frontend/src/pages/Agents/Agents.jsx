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
import { agentService } from '../../services/agentService';
import AgentForm from '../../components/agents/AgentForm';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentService.getAll();
      setAgents(data);
    } catch (error) {
      showSnackbar('Erreur lors du chargement des agents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleAddClick = () => {
    setSelectedAgent(null);
    setFormOpen(true);
  };

  const handleEditClick = (agent) => {
    setSelectedAgent(agent);
    setFormOpen(true);
  };

  const handleDeleteClick = (agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (selectedAgent) {
        await agentService.update(selectedAgent.id, data);
        showSnackbar('Agent modifié avec succès', 'success');
      } else {
        await agentService.create(data);
        showSnackbar('Agent ajouté avec succès', 'success');
      }
      setFormOpen(false);
      fetchAgents();
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
      await agentService.delete(agentToDelete.id);
      showSnackbar('Agent supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      fetchAgents();
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

  const filteredAgents = agents.filter(
    (agent) =>
      agent.matricule.toLowerCase().includes(search.toLowerCase()) ||
      agent.nom.toLowerCase().includes(search.toLowerCase()) ||
      agent.prenom.toLowerCase().includes(search.toLowerCase()) ||
      (agent.email && agent.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des Agents
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Ajouter un Agent
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par matricule, nom, prénom ou email..."
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
                <TableCell>Matricule</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Adresse IP</TableCell>
                <TableCell>Poste</TableCell>
                <TableCell>Bureau</TableCell>
                <TableCell>Matériels</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun agent trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => (
                  <TableRow key={agent.id} hover>
                    <TableCell>{agent.matricule}</TableCell>
                    <TableCell>{agent.nom}</TableCell>
                    <TableCell>{agent.prenom}</TableCell>
                    <TableCell>{agent.email || '-'}</TableCell>
                    <TableCell>{agent.telephone || '-'}</TableCell>
                    <TableCell>
                      {agent.adresseIP ? (
                        <Chip
                          label={agent.adresseIP}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{agent.poste || '-'}</TableCell>
                    <TableCell>
                      {agent.bureau ? (
                        <Chip
                          label={`${agent.bureau.code} - ${agent.bureau.nom}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={agent._count?.materiels || 0}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEditClick(agent)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(agent)}>
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

      <AgentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        agent={selectedAgent}
        loading={submitting}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'agent "{agentToDelete?.nom} {agentToDelete?.prenom}" ?
            {agentToDelete?._count?.materiels > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Cet agent a {agentToDelete._count.materiels} matériel(s) assigné(s).
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

export default Agents;
