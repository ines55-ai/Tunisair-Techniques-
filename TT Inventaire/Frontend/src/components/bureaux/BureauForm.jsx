import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from '@mui/material';

function BureauForm({ open, onClose, onSubmit, bureau, loading }) {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    etage: '',
    batiment: '',
    capacite: '',
  });

  useEffect(() => {
    if (open) {
      if (bureau) {
        setFormData({
          code: bureau.code || '',
          nom: bureau.nom || '',
          etage: bureau.etage || '',
          batiment: bureau.batiment || '',
          capacite: bureau.capacite || '',
        });
      } else {
        setFormData({
          code: '',
          nom: '',
          etage: '',
          batiment: '',
          capacite: '',
        });
      }
    }
  }, [open, bureau]);

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
      capacite: formData.capacite ? parseInt(formData.capacite, 10) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {bureau ? 'Modifier le Bureau' : 'Ajouter un Bureau'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={!!bureau}
                helperText="Ex: B101, B202"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nom du Bureau"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Étage"
                name="etage"
                value={formData.etage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bâtiment"
                name="batiment"
                value={formData.batiment}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Capacité"
                name="capacite"
                value={formData.capacite}
                onChange={handleChange}
                inputProps={{ min: '1' }}
                helperText="Nombre de personnes"
              />
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
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : bureau ? (
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

export default BureauForm;
