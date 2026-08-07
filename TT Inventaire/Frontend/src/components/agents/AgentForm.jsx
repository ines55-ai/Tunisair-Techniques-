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
} from '@mui/material';
import { bureauService } from '../../services/bureauService';

function AgentForm({ open, onClose, onSubmit, agent, loading }) {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    adresseIP: '',
    bureauId: '',
  });

  const [bureaux, setBureaux] = useState([]);
  const [loadingBureaux, setLoadingBureaux] = useState(true);

  useEffect(() => {
    if (open) {
      fetchBureaux();
      if (agent) {
        setFormData({
          matricule: agent.matricule || '',
          nom: agent.nom || '',
          prenom: agent.prenom || '',
          email: agent.email || '',
          telephone: agent.telephone || '',
          poste: agent.poste || '',
          adresseIP: agent.adresseIP || '',
          bureauId: agent.bureauId || '',
        });
      } else {
        setFormData({
          matricule: '',
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          poste: '',
          adresseIP: '',
          bureauId: '',
        });
      }
    }
  }, [open, agent]);

  const fetchBureaux = async () => {
    try {
      setLoadingBureaux(true);
      const data = await bureauService.getAll();
      setBureaux(data);
    } catch (error) {
      console.error('Erreur lors du chargement des bureaux:', error);
    } finally {
      setLoadingBureaux(false);
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

    const submitData = {
      ...formData,
      bureauId: formData.bureauId ? parseInt(formData.bureauId, 10) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {agent ? 'Modifier l\'Agent' : 'Ajouter un Agent'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Matricule"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                disabled={!!agent}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Poste"
                name="poste"
                value={formData.poste}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Adresse IP"
                name="adresseIP"
                value={formData.adresseIP}
                onChange={handleChange}
                placeholder="Ex: 192.168.1.100"
                helperText="Adresse IP du poste de l'agent"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Bureau"
                name="bureauId"
                value={formData.bureauId}
                onChange={handleChange}
                disabled={loadingBureaux}
              >
                <MenuItem value="">Aucun</MenuItem>
                {bureaux.map((bureau) => (
                  <MenuItem key={bureau.id} value={bureau.id}>
                    {bureau.code} - {bureau.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingBureaux}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : agent ? (
              'Modifier'
            ) : (
              'Ajouter'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AgentForm;
