import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Autocomplete,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  SwapHoriz as TransfertIcon,
  Assignment as AffectationIcon,
  Undo as RetourIcon,
  Build as MaintenanceIcon,
  Delete as ReformeIcon,
} from '@mui/icons-material';
import { materielService } from '../../services/materielService';
import { agentService } from '../../services/agentService';

const typesMouvement = [
  {
    value: 'AFFECTATION',
    label: 'Affectation',
    icon: <AffectationIcon />,
    description: 'Assigner un matériel à un agent',
    color: '#4caf50',
  },
  {
    value: 'RETOUR',
    label: 'Retour',
    icon: <RetourIcon />,
    description: 'Retourner un matériel au stock',
    color: '#ff9800',
  },
  {
    value: 'TRANSFERT',
    label: 'Transfert',
    icon: <TransfertIcon />,
    description: 'Transférer un matériel entre agents',
    color: '#2196f3',
  },
  {
    value: 'MAINTENANCE',
    label: 'Maintenance',
    icon: <MaintenanceIcon />,
    description: 'Mettre un matériel en maintenance',
    color: '#9c27b0',
  },
  {
    value: 'REFORME',
    label: 'Réforme',
    icon: <ReformeIcon />,
    description: 'Retirer définitivement un matériel',
    color: '#f44336',
  },
];

const steps = ['Type de mouvement', 'Informations', 'Confirmation'];

function MouvementForm({ open, onClose, onSubmit, loading }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    typeMouvement: '',
    materielId: '',
    agentSourceId: '',
    agentDestId: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    motif: '',
    remarques: '',
    validePar: '',
  });

  const [materiels, setMateriels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [selectedAgentSource, setSelectedAgentSource] = useState(null);
  const [selectedAgentDest, setSelectedAgentDest] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
      resetForm();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [materielsData, agentsData] = await Promise.all([
        materielService.getAll(1, 1000, ''),
        agentService.getAll(),
      ]);
      setMateriels(materielsData.data);
      setAgents(agentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      typeMouvement: '',
      materielId: '',
      agentSourceId: '',
      agentDestId: '',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      motif: '',
      remarques: '',
      validePar: '',
    });
    setSelectedMateriel(null);
    setSelectedAgentSource(null);
    setSelectedAgentDest(null);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, typeMouvement: type });
    handleNext();
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
      // Pré-remplir l'agent source si le matériel est affecté
      agentSourceId: newValue?.agentId || '',
    }));
    
    if (newValue?.agentId) {
      const agent = agents.find(a => a.id === newValue.agentId);
      setSelectedAgentSource(agent);
    } else {
      setSelectedAgentSource(null);
    }
  };

  const handleAgentSourceChange = (event, newValue) => {
    setSelectedAgentSource(newValue);
    setFormData((prev) => ({
      ...prev,
      agentSourceId: newValue ? newValue.id : '',
    }));
  };

  const handleAgentDestChange = (event, newValue) => {
    setSelectedAgentDest(newValue);
    setFormData((prev) => ({
      ...prev,
      agentDestId: newValue ? newValue.id : '',
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      materielId: parseInt(formData.materielId, 10),
      typeMouvement: formData.typeMouvement,
      agentSourceId: formData.agentSourceId ? parseInt(formData.agentSourceId, 10) : undefined,
      agentDestId: formData.agentDestId ? parseInt(formData.agentDestId, 10) : undefined,
      date: formData.dateDebut ? new Date(formData.dateDebut).toISOString() : undefined,
      dateRetourPrevue: formData.dateFin ? new Date(formData.dateFin).toISOString() : undefined,
      description: formData.motif, // Mapper motif vers description
      remarques: formData.remarques,
      effectuePar: formData.validePar,
    };

    // Nettoyer les champs vides
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '' || submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    onSubmit(submitData);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            {typesMouvement.map((type) => (
              <Grid item xs={12} sm={6} key={type.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: formData.typeMouvement === type.value ? 2 : 1,
                    borderColor: formData.typeMouvement === type.value ? type.color : 'divider',
                    '&:hover': {
                      borderColor: type.color,
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleTypeSelect(type.value)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ color: type.color, mr: 1 }}>{type.icon}</Box>
                      <Typography variant="h6">{type.label}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                value={selectedMateriel}
                onChange={handleMaterielChange}
                options={materiels}
                getOptionLabel={(option) =>
                  `${option.numeroSerie} - ${option.nom} (${option.categorie?.nom || ''}) - ${option.statut}`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Matériel"
                    required
                    disabled={loadingData}
                  />
                )}
                disabled={loadingData}
              />
              {selectedMateriel && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Statut actuel: <strong>{selectedMateriel.statut}</strong>
                  {selectedMateriel.agent && (
                    <> - Affecté à: <strong>{selectedMateriel.agent.nom} {selectedMateriel.agent.prenom}</strong></>
                  )}
                </Alert>
              )}
            </Grid>

            {(formData.typeMouvement === 'RETOUR' || formData.typeMouvement === 'TRANSFERT') && (
              <Grid item xs={12}>
                <Autocomplete
                  value={selectedAgentSource}
                  onChange={handleAgentSourceChange}
                  options={agents}
                  getOptionLabel={(option) =>
                    `${option.matricule} - ${option.nom} ${option.prenom}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Agent Source"
                      required
                      disabled={loadingData || !!selectedMateriel?.agentId}
                    />
                  )}
                  disabled={loadingData || !!selectedMateriel?.agentId}
                />
              </Grid>
            )}

            {(formData.typeMouvement === 'AFFECTATION' || formData.typeMouvement === 'TRANSFERT') && (
              <Grid item xs={12}>
                <Autocomplete
                  value={selectedAgentDest}
                  onChange={handleAgentDestChange}
                  options={agents}
                  getOptionLabel={(option) =>
                    `${option.matricule} - ${option.nom} ${option.prenom}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Agent Destination"
                      required
                      disabled={loadingData}
                    />
                  )}
                  disabled={loadingData}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date de début"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {formData.typeMouvement === 'MAINTENANCE' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date de fin prévue"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motif"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                required={['RETOUR', 'TRANSFERT', 'MAINTENANCE', 'REFORME'].includes(formData.typeMouvement)}
                multiline
                rows={2}
              />
            </Grid>

            {formData.typeMouvement === 'REFORME' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Validé par"
                  name="validePar"
                  value={formData.validePar}
                  onChange={handleChange}
                  required
                  helperText="Nom du manager/admin validant la réforme"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarques"
                name="remarques"
                value={formData.remarques}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        );

      case 2:
        const typeInfo = typesMouvement.find(t => t.value === formData.typeMouvement);
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Vérifiez les informations avant de confirmer le mouvement
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Type de mouvement</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: typeInfo?.color }}>
                  {typeInfo?.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>{typeInfo?.label}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Matériel</Typography>
                <Typography>{selectedMateriel?.numeroSerie} - {selectedMateriel?.nom}</Typography>
              </Grid>
              {selectedAgentSource && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Agent Source</Typography>
                  <Typography>{selectedAgentSource.matricule} - {selectedAgentSource.nom} {selectedAgentSource.prenom}</Typography>
                </Grid>
              )}
              {selectedAgentDest && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Agent Destination</Typography>
                  <Typography>{selectedAgentDest.matricule} - {selectedAgentDest.nom} {selectedAgentDest.prenom}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Date de début</Typography>
                <Typography>{new Date(formData.dateDebut).toLocaleDateString('fr-FR')}</Typography>
              </Grid>
              {formData.motif && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Motif</Typography>
                  <Typography>{formData.motif}</Typography>
                </Grid>
              )}
              {formData.remarques && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Remarques</Typography>
                  <Typography>{formData.remarques}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nouveau Mouvement</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {loadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderStepContent()
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Retour
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={activeStep === 0 && !formData.typeMouvement}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmer'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default MouvementForm;
