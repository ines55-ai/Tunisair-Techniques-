import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import categorieService from '../../services/categorieService';
import bureauService from '../../services/bureauService';
import agentService from '../../services/agentService';

const steps = ['Informations générales', 'Périmètre'];

const perimetreTypes = [
  { value: 'TOUS', label: 'Tous les matériels' },
  { value: 'CATEGORIE', label: 'Par catégorie' },
  { value: 'BUREAU', label: 'Par bureau' },
  { value: 'AGENT', label: 'Par agent' },
  { value: 'STATUT', label: 'Par statut' },
];

const statutsMateriels = [
  { value: 'EN_SERVICE', label: 'En service' },
  { value: 'EN_PANNE', label: 'En panne' },
  { value: 'EN_MAINTENANCE', label: 'En maintenance' },
  { value: 'EN_STOCK', label: 'En stock' },
  { value: 'REFORME', label: 'Réformé' },
];

const InventaireForm = ({ open, onClose, onSubmit, inventaire = null }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [bureaux, setBureaux] = useState([]);
  const [agents, setAgents] = useState([]);

  const [formData, setFormData] = useState({
    titre: '',
    dateDebut: new Date().toISOString().split('T')[0],
    responsable: '',
    remarques: '',
    perimetreType: 'TOUS',
    perimetreIds: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (inventaire) {
      setFormData({
        titre: inventaire.titre || '',
        dateDebut: inventaire.dateDebut ? inventaire.dateDebut.split('T')[0] : new Date().toISOString().split('T')[0],
        responsable: inventaire.responsable || '',
        remarques: inventaire.remarques || '',
        perimetreType: inventaire.perimetreType || 'TOUS',
        perimetreIds: inventaire.perimetreIds || [],
      });
    } else {
      setFormData({
        titre: '',
        dateDebut: new Date().toISOString().split('T')[0],
        responsable: '',
        remarques: '',
        perimetreType: 'TOUS',
        perimetreIds: [],
      });
    }
    setActiveStep(0);
  }, [inventaire, open]);

  const loadData = async () => {
    try {
      const [categoriesData, bureauxData, agentsData] = await Promise.all([
        categorieService.getAll(),
        bureauService.getAll(),
        agentService.getAll(),
      ]);
      setCategories(categoriesData);
      setBureaux(bureauxData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePerimetreTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      perimetreType: e.target.value,
      perimetreIds: [], // Reset IDs when type changes
    }));
  };

  const handlePerimetreIdsChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      perimetreIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    const dataToSubmit = {
      ...formData,
      perimetreIds: formData.perimetreType === 'STATUT' 
        ? formData.perimetreIds 
        : formData.perimetreIds.map(id => parseInt(id)),
    };
    
    onSubmit(dataToSubmit);
    setActiveStep(0);
  };

  const getPerimetreOptions = () => {
    switch (formData.perimetreType) {
      case 'CATEGORIE':
        return categories.map(cat => ({ value: cat.id, label: cat.nom }));
      case 'BUREAU':
        return bureaux.map(bureau => ({ value: bureau.id, label: `${bureau.code} - ${bureau.nom}` }));
      case 'AGENT':
        return agents.map(agent => ({ value: agent.id, label: `${agent.matricule} - ${agent.nom} ${agent.prenom}` }));
      case 'STATUT':
        return statutsMateriels;
      default:
        return [];
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Titre de l'inventaire"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Date de début"
              name="dateDebut"
              type="date"
              value={formData.dateDebut}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Responsable"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Remarques"
              name="remarques"
              value={formData.remarques}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type de périmètre</InputLabel>
              <Select
                name="perimetreType"
                value={formData.perimetreType}
                onChange={handlePerimetreTypeChange}
                label="Type de périmètre"
              >
                {perimetreTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.perimetreType !== 'TOUS' && (
              <FormControl fullWidth>
                <InputLabel>Sélection</InputLabel>
                <Select
                  multiple
                  value={formData.perimetreIds}
                  onChange={handlePerimetreIdsChange}
                  input={<OutlinedInput label="Sélection" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const option = getPerimetreOptions().find(opt => opt.value.toString() === value.toString());
                        return <Chip key={value} label={option?.label || value} />;
                      })}
                    </Box>
                  )}
                >
                  {getPerimetreOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.perimetreType === 'TOUS' && (
              <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                Tous les matériels seront inclus dans cet inventaire.
              </Box>
            )}
          </Box>
        );

      default:
        return 'Étape inconnue';
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.titre && formData.dateDebut && formData.responsable;
      case 1:
        return formData.perimetreType === 'TOUS' || formData.perimetreIds.length > 0;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {inventaire ? 'Modifier l\'inventaire' : 'Créer un inventaire'}
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 2, pb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Retour
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            Suivant
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isStepValid()}
          >
            {inventaire ? 'Modifier' : 'Créer'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InventaireForm;
