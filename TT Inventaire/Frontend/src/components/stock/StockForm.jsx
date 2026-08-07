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
  Autocomplete,
} from '@mui/material';
import { materielService } from '../../services/materielService';

const etatOptions = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'RESERVE', label: 'Réservé' },
  { value: 'EN_COMMANDE', label: 'En Commande' },
  { value: 'ENDOMMAGE', label: 'Endommagé' },
];

function StockForm({ open, onClose, onSubmit, stock, loading }) {
  const [formData, setFormData] = useState({
    materielId: '',
    dateArrivage: '',
    quantite: 1,
    seuilAlerte: '',
    emplacement: '',
    etat: 'DISPONIBLE',
    remarques: '',
  });

  const [materiels, setMateriels] = useState([]);
  const [loadingMateriels, setLoadingMateriels] = useState(true);
  const [selectedMateriel, setSelectedMateriel] = useState(null);

  useEffect(() => {
    if (open) {
      fetchMateriels();
      if (stock) {
        setFormData({
          materielId: stock.materielId || '',
          dateArrivage: stock.dateArrivage
            ? new Date(stock.dateArrivage).toISOString().split('T')[0]
            : '',
          quantite: stock.quantite || 1,
          seuilAlerte: stock.seuilAlerte || '',
          emplacement: stock.emplacement || '',
          etat: stock.etat || 'DISPONIBLE',
          remarques: stock.remarques || '',
        });
        if (stock.materiel) {
          setSelectedMateriel(stock.materiel);
        }
      } else {
        setFormData({
          materielId: '',
          dateArrivage: new Date().toISOString().split('T')[0],
          quantite: 1,
          seuilAlerte: '',
          emplacement: '',
          etat: 'DISPONIBLE',
          remarques: '',
        });
        setSelectedMateriel(null);
      }
    }
  }, [open, stock]);

  const fetchMateriels = async () => {
    try {
      setLoadingMateriels(true);
      // Récupérer les matériels avec statut EN_STOCK
      const response = await materielService.getAll(1, 1000, '');
      setMateriels(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matériels:', error);
    } finally {
      setLoadingMateriels(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMaterielChange = (event, newValue) => {
    setSelectedMateriel(newValue);
    setFormData((prev) => ({
      ...prev,
      materielId: newValue ? newValue.id : '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      materielId: parseInt(formData.materielId, 10),
      quantite: parseInt(formData.quantite, 10),
      seuilAlerte: formData.seuilAlerte ? parseInt(formData.seuilAlerte, 10) : undefined,
      dateArrivage: formData.dateArrivage
        ? new Date(formData.dateArrivage).toISOString()
        : new Date().toISOString(),
    };

    // Supprimer les champs vides
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '' || submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {stock ? 'Modifier l\'Entrée Stock' : 'Ajouter au Stock'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                value={selectedMateriel}
                onChange={handleMaterielChange}
                options={materiels || []}
                getOptionLabel={(option) =>
                  `${option.numeroSerie} - ${option.nom} (${option.categorie?.nom || ''})`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Matériel"
                    required
                    disabled={!!stock || loadingMateriels}
                  />
                )}
                disabled={!!stock || loadingMateriels}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date d'Arrivage"
                name="dateArrivage"
                value={formData.dateArrivage}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="État"
                name="etat"
                value={formData.etat}
                onChange={handleChange}
              >
                {etatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Quantité"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                inputProps={{ min: '1' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Seuil d'Alerte"
                name="seuilAlerte"
                value={formData.seuilAlerte}
                onChange={handleChange}
                inputProps={{ min: '1' }}
                helperText="Alerte si quantité < seuil"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emplacement"
                name="emplacement"
                value={formData.emplacement}
                onChange={handleChange}
                helperText="Ex: Magasin A, Étagère 3, Casier 12"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarques"
                name="remarques"
                value={formData.remarques}
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
            disabled={loading || loadingMateriels}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : stock ? (
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

export default StockForm;
