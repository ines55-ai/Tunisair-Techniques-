import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { SwapHoriz as TransferIcon } from '@mui/icons-material';
import { agentService } from '../../services/agentService';
import { bureauService } from '../../services/bureauService';

/**
 * Dialog pour transférer un matériel d'un agent à un autre
 */
function TransfertDialog({ open, onClose, onSubmit, materiel, loading }) {
  const [formData, setFormData] = useState({
    nouvelAgentId: '',
    nouveauBureauId: '',
    dateTransfert: new Date().toISOString().split('T')[0],
    observation: '',
  });

  const [agents, setAgents] = useState([]);
  const [bureaux, setBureaux] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchData();
      // Réinitialiser le formulaire
      setFormData({
        nouvelAgentId: '',
        nouveauBureauId: '',
        dateTransfert: new Date().toISOString().split('T')[0],
        observation: '',
      });
      setError('');
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [agentsData, bureauxData] = await Promise.all([
        agentService.getAll(),
        bureauService.getAll(),
      ]);
      setAgents(agentsData);
      setBureaux(bureauxData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des agents et bureaux');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nouvelAgentId || !formData.nouveauBureauId) {
      setError('Veuillez sélectionner un nouvel agent et un nouveau bureau');
      return;
    }

    // Vérifier que le nouvel agent est différent de l'ancien
    if (materiel.agentId && parseInt(formData.nouvelAgentId) === materiel.agentId) {
      setError('Le nouvel agent doit être différent de l\'agent actuel');
      return;
    }

    const submitData = {
      materielId: materiel.id,
      typeMouvement: 'TRANSFERT',
      agentSourceId: materiel.agentId,
      agentDestId: parseInt(formData.nouvelAgentId, 10),
      date: new Date(formData.dateTransfert).toISOString(),
      description: formData.observation,
      remarques: formData.observation,
      nouveauBureauId: parseInt(formData.nouveauBureauId, 10), // Pour mise à jour matériel
    };

    onSubmit(submitData);
  };

  const nouvelAgent = agents.find(a => a.id === parseInt(formData.nouvelAgentId));
  const nouveauBureau = bureaux.find(b => b.id === parseInt(formData.nouveauBureauId));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TransferIcon color="primary" />
          <Typography variant="h6">Transférer un Matériel</Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Informations du matériel */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Matériel à transférer
            </Typography>
            <Typography variant="h6">{materiel?.nom}</Typography>
            <Typography variant="body2" color="text.secondary">
              N° Série: {materiel?.numeroSerie}
            </Typography>
          </Box>

          {/* Informations actuelles */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>
              Affectation Actuelle
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Agent actuel
                </Typography>
                <Typography variant="body1">
                  {materiel?.agent
                    ? `${materiel.agent.nom} ${materiel.agent.prenom}`
                    : 'Non affecté'}
                </Typography>
                {materiel?.agent?.matricule && (
                  <Typography variant="caption" color="text.secondary">
                    Matricule: {materiel.agent.matricule}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Bureau actuel
                </Typography>
                <Typography variant="body1">
                  {materiel?.bureau ? materiel.bureau.nom : 'Non défini'}
                </Typography>
                {materiel?.bureau?.code && (
                  <Typography variant="caption" color="text.secondary">
                    Code: {materiel.bureau.code}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Nouvelle affectation */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Nouvelle Affectation
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Nouvel Agent"
                name="nouvelAgentId"
                value={formData.nouvelAgentId}
                onChange={handleChange}
                disabled={loadingData}
                helperText="Sélectionnez l'agent qui recevra le matériel"
              >
                {agents
                  .filter(a => a.id !== materiel?.agentId) // Exclure l'agent actuel
                  .map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.nom} {agent.prenom} - {agent.matricule}
                      {agent.poste && ` (${agent.poste})`}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Nouveau Bureau"
                name="nouveauBureauId"
                value={formData.nouveauBureauId}
                onChange={handleChange}
                disabled={loadingData}
                helperText="Bureau où sera transféré le matériel"
              >
                {bureaux.map((bureau) => (
                  <MenuItem key={bureau.id} value={bureau.id}>
                    {bureau.nom} - {bureau.code}
                    {bureau.etage && ` (Étage ${bureau.etage})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date du Transfert"
                name="dateTransfert"
                value={formData.dateTransfert}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observation"
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                placeholder="Motif du transfert, remarques..."
              />
            </Grid>
          </Grid>

          {/* Récapitulatif */}
          {nouvelAgent && nouveauBureau && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Récapitulatif du Transfert
              </Typography>
              <Typography variant="body2">
                Le matériel <strong>{materiel?.nom}</strong> sera transféré de{' '}
                <strong>
                  {materiel?.agent
                    ? `${materiel.agent.nom} ${materiel.agent.prenom}`
                    : 'non affecté'}
                </strong>{' '}
                vers <strong>{nouvelAgent.nom} {nouvelAgent.prenom}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Bureau: <strong>{materiel?.bureau?.nom || 'non défini'}</strong> →{' '}
                <strong>{nouveauBureau.nom}</strong>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingData}
            startIcon={loading ? <CircularProgress size={20} /> : <TransferIcon />}
          >
            {loading ? 'Transfert...' : 'Transférer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransfertDialog;
