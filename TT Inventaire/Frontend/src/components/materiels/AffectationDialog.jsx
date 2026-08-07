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
} from '@mui/material';
import { AssignmentInd as AssignIcon } from '@mui/icons-material';
import { agentService } from '../../services/agentService';
import { bureauService } from '../../services/bureauService';

/**
 * Dialog pour affecter un matériel à un agent
 */
function AffectationDialog({ open, onClose, onSubmit, materiel, loading }) {
  const [formData, setFormData] = useState({
    agentId: '',
    bureauId: '',
    dateAffectation: new Date().toISOString().split('T')[0],
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
        agentId: '',
        bureauId: '',
        dateAffectation: new Date().toISOString().split('T')[0],
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

    if (!formData.agentId || !formData.bureauId) {
      setError('Veuillez sélectionner un agent et un bureau');
      return;
    }

    const submitData = {
      materielId: materiel.id,
      typeMouvement: 'AFFECTATION',
      agentDestId: parseInt(formData.agentId, 10),
      date: new Date(formData.dateAffectation).toISOString(),
      remarques: formData.observation,
      bureauId: parseInt(formData.bureauId, 10), // Passer le bureauId pour mise à jour matériel
    };

    onSubmit(submitData);
  };

  const selectedAgent = agents.find(a => a.id === parseInt(formData.agentId));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignIcon color="primary" />
          <Typography variant="h6">Affecter un Matériel</Typography>
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
              Matériel à affecter
            </Typography>
            <Typography variant="h6">{materiel?.nom}</Typography>
            <Typography variant="body2" color="text.secondary">
              N° Série: {materiel?.numeroSerie}
            </Typography>
            {materiel?.numeroInventaire && (
              <Typography variant="body2" color="text.secondary">
                N° Inventaire: {materiel?.numeroInventaire}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Agent"
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                disabled={loadingData}
                helperText="Sélectionnez l'agent qui recevra le matériel"
              >
                {agents.map((agent) => (
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
                label="Bureau"
                name="bureauId"
                value={formData.bureauId}
                onChange={handleChange}
                disabled={loadingData}
                helperText="Bureau où sera affecté le matériel"
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
                label="Date d'Affectation"
                name="dateAffectation"
                value={formData.dateAffectation}
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
                placeholder="Remarques ou observations sur cette affectation..."
              />
            </Grid>
          </Grid>

          {/* Récapitulatif si agent sélectionné */}
          {selectedAgent && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary.main" gutterBottom>
                Récapitulatif
              </Typography>
              <Typography variant="body2">
                Le matériel <strong>{materiel?.nom}</strong> sera affecté à{' '}
                <strong>
                  {selectedAgent.nom} {selectedAgent.prenom}
                </strong>
                .
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
            startIcon={loading ? <CircularProgress size={20} /> : <AssignIcon />}
          >
            {loading ? 'Affectation...' : 'Affecter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AffectationDialog;
