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
import { categorieService } from '../../services/categorieService';

const statutOptions = [
  { value: 'EN_SERVICE', label: 'En Service' },
  { value: 'EN_PANNE', label: 'En Panne' },
  { value: 'EN_MAINTENANCE', label: 'En Maintenance' },
  { value: 'EN_STOCK', label: 'En Stock' },
  { value: 'REFORME', label: 'Réformé' },
  { value: 'PERDU', label: 'Perdu' },
];

function MaterielForm({ open, onClose, onSubmit, materiel, loading }) {
  const [formData, setFormData] = useState({
    numeroSerie: '',
    numeroInventaire: '',
    nom: '',
    marque: '',
    modele: '',
    categorieId: '',
    statut: 'EN_SERVICE',
    dateAcquisition: '',
    garantieExpire: '',
    valeur: '',
    agentId: '',
    bureauId: '',
    description: '',
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (materiel) {
        setFormData({
          numeroSerie: materiel.numeroSerie || '',
          numeroInventaire: materiel.numeroInventaire || '',
          nom: materiel.nom || '',
          marque: materiel.marque || '',
          modele: materiel.modele || '',
          categorieId: materiel.categorieId || '',
          statut: materiel.statut || 'EN_SERVICE',
          dateAcquisition: materiel.dateAcquisition
            ? materiel.dateAcquisition.split('T')[0]
            : '',
          garantieExpire: materiel.garantieExpire
            ? materiel.garantieExpire.split('T')[0]
            : '',
          valeur: materiel.valeur || '',
          agentId: materiel.agentId || '',
          bureauId: materiel.bureauId || '',
          description: materiel.description || '',
        });
      } else {
        setFormData({
          numeroSerie: '',
          numeroInventaire: '',
          nom: '',
          marque: '',
          modele: '',
          categorieId: '',
          statut: 'EN_SERVICE',
          dateAcquisition: '',
          garantieExpire: '',
          valeur: '',
          agentId: '',
          bureauId: '',
          description: '',
        });
      }
    }
  }, [open, materiel]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categorieService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoadingCategories(false);
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
      categorieId: parseInt(formData.categorieId, 10),
      valeur: formData.valeur ? parseFloat(formData.valeur) : undefined,
      agentId: formData.agentId ? parseInt(formData.agentId, 10) : undefined,
      bureauId: formData.bureauId ? parseInt(formData.bureauId, 10) : undefined,
      dateAcquisition: formData.dateAcquisition
        ? new Date(formData.dateAcquisition).toISOString()
        : undefined,
      garantieExpire: formData.garantieExpire
        ? new Date(formData.garantieExpire).toISOString()
        : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {materiel ? 'Modifier le Matériel' : 'Ajouter un Matériel'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Numéro de Série"
                name="numeroSerie"
                value={formData.numeroSerie}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro d'Inventaire"
                name="numeroInventaire"
                value={formData.numeroInventaire}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nom du Matériel"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marque"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Modèle"
                name="modele"
                value={formData.modele}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Catégorie"
                name="categorieId"
                value={formData.categorieId}
                onChange={handleChange}
                disabled={loadingCategories}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
              >
                {statutOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date d'Acquisition"
                name="dateAcquisition"
                value={formData.dateAcquisition}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Garantie Expire"
                name="garantieExpire"
                value={formData.garantieExpire}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Valeur (DT)"
                name="valeur"
                value={formData.valeur}
                onChange={handleChange}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
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
            disabled={loading || loadingCategories}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : materiel ? (
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

export default MaterielForm;
