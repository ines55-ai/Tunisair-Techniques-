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
  Rating,
} from '@mui/material';
import { Error as PanneIcon } from '@mui/icons-material';

/**
 * Dialog pour déclarer une panne sur un matériel
 */
function PanneDialog({ open, onClose, onSubmit, materiel, loading }) {
  const [formData, setFormData] = useState({
    datePanne: new Date().toISOString().split('T')[0],
    description: '',
    gravite: 'MOYENNE',
    observation: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      // Réinitialiser le formulaire
      setFormData({
        datePanne: new Date().toISOString().split('T')[0],
        description: '',
        gravite: 'MOYENNE',
        observation: '',
      });
      setError('');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setError('Veuillez décrire la panne');
      return;
    }

    const submitData = {
      materielId: materiel.id,
      datePanne: new Date(formData.datePanne).toISOString(),
      description: formData.description,
      gravite: formData.gravite,
      observation: formData.observation,
    };

    onSubmit(submitData);
  };

  const graviteOptions = [
    { value: 'FAIBLE', label: 'Faible', color: 'info' },
    { value: 'MOYENNE', label: 'Moyenne', color: 'warning' },
    { value: 'ELEVEE', label: 'Élevée', color: 'error' },
    { value: 'CRITIQUE', label: 'Critique', color: 'error' },
  ];

  const getGraviteIcon = (gravite) => {
    switch (gravite) {
      case 'FAIBLE':
        return 1;
      case 'MOYENNE':
        return 2;
      case 'ELEVEE':
        return 3;
      case 'CRITIQUE':
        return 4;
      default:
        return 2;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PanneIcon color="error" />
          <Typography variant="h6">Déclarer une Panne</Typography>
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
          <Box sx={{ mb: 3, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="error.main">
              Matériel en panne
            </Typography>
            <Typography variant="h6">{materiel?.nom}</Typography>
            <Typography variant="body2" color="text.secondary">
              N° Série: {materiel?.numeroSerie}
            </Typography>
            {materiel?.agent && (
              <Typography variant="body2" color="text.secondary">
                Affecté à: {materiel.agent.nom} {materiel.agent.prenom}
              </Typography>
            )}
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Le statut du matériel sera automatiquement changé en "EN_PANNE"
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date de la Panne"
                name="datePanne"
                value={formData.datePanne}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description de la Panne"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez précisément la panne constatée..."
                helperText="Indiquez les symptômes, messages d'erreur, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Niveau de Gravité"
                name="gravite"
                value={formData.gravite}
                onChange={handleChange}
                helperText="Évaluez l'impact de la panne sur l'activité"
              >
                {graviteOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={getGraviteIcon(option.value)}
                        max={4}
                        size="small"
                        readOnly
                      />
                      <Typography>{option.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observation"
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                placeholder="Actions déjà tentées, contexte, remarques..."
              />
            </Grid>
          </Grid>

          {/* Légende gravité */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Guide de Gravité:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • <strong>Faible:</strong> Gêne mineure, service maintenu
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • <strong>Moyenne:</strong> Impact modéré, réduction de performance
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • <strong>Élevée:</strong> Fonctionnalités importantes indisponibles
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • <strong>Critique:</strong> Matériel totalement hors service
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PanneIcon />}
          >
            {loading ? 'Enregistrement...' : 'Déclarer la Panne'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default PanneDialog;
