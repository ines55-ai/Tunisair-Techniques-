import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import rapportService from '../../services/rapportService';
import BrandLogo from '../../components/common/BrandLogo';
import { APP_NAME, COMPANY_NAME } from '../../utils/constants';

const Rapports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [annee, setAnnee] = useState(currentYear);
  const [mois, setMois] = useState(currentMonth);
  const [rapport, setRapport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const moisOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  const anneeOptions = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    anneeOptions.push(i);
  }

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rapportService.getMonthlyReport(annee, mois);
      setRapport(data);
    } catch (err) {
      console.error('Erreur lors de la génération du rapport:', err);
      setError('Erreur lors de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await rapportService.downloadMonthlyPDF(annee, mois);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      setError('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloading(false);
    }
  };

  const getMoisLabel = (moisNum) => {
    const option = moisOptions.find((m) => m.value === moisNum);
    return option ? option.label : moisNum;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Rapports
        </Typography>
      </Box>

      {/* Sélecteurs */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Générer un rapport mensuel
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Année</InputLabel>
              <Select
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                label="Année"
              >
                {anneeOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Mois</InputLabel>
              <Select
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                label="Mois"
              >
                {moisOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
            >
              {loading ? 'Génération...' : 'Générer le rapport'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Résultats du rapport */}
      {rapport && (
        <>
          {/* En-tête du rapport */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BrandLogo height={52} />
                <Box>
                  <Typography variant="h5">
                    Rapport {getMoisLabel(rapport.periode.mois)} {rapport.periode.annee}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {COMPANY_NAME} - {APP_NAME}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="error"
                startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
                onClick={handleDownloadPDF}
                disabled={downloading}
              >
                {downloading ? 'Téléchargement...' : 'Télécharger PDF'}
              </Button>
            </Box>
          </Paper>

          {/* Statistiques principales */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Matériels */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Matériels
                  </Typography>
                  <Typography variant="h4">{rapport.statistiques.materiels.total}</Typography>
                  <Typography variant="body2" color="success.main">
                    +{rapport.statistiques.materiels.nouveaux} ce mois
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Mouvements */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Mouvements
                  </Typography>
                  <Typography variant="h4">{rapport.statistiques.mouvements.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ce mois
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Inventaires */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Inventaires
                  </Typography>
                  <Typography variant="h4">{rapport.statistiques.inventaires.total}</Typography>
                  <Typography variant="body2" color="info.main">
                    {rapport.statistiques.inventaires.termines} terminés
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>

          {/* Détails Matériels */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Matériels par Statut
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {Object.entries(rapport.statistiques.materiels.parStatut).map(([statut, count]) => (
                <Grid item xs={12} sm={6} md={4} key={statut}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography>{statut.replace('_', ' ')}</Typography>
                    <Typography variant="h6">{count}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Détails Mouvements */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mouvements par Type
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {Object.entries(rapport.statistiques.mouvements.parType).map(([type, count]) => (
                <Grid item xs={12} sm={6} md={4} key={type}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography>{type}</Typography>
                    <Typography variant="h6">{count}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Agents et Bureaux */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Agents
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Total</Typography>
                    <Typography variant="h6">{rapport.statistiques.agents.total}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="success.main">Avec matériels</Typography>
                    <Typography variant="h6">{rapport.statistiques.agents.avecMateriels}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Sans matériels</Typography>
                    <Typography variant="h6">{rapport.statistiques.agents.sansMateriels}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bureaux
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Total</Typography>
                    <Typography variant="h6">{rapport.statistiques.bureaux.total}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="success.main">Occupés</Typography>
                    <Typography variant="h6">{rapport.statistiques.bureaux.occupes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Vides</Typography>
                    <Typography variant="h6">{rapport.statistiques.bureaux.vides}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Message initial */}
      {!rapport && !loading && (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <AssessmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sélectionnez une période et générez un rapport
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Le rapport inclura toutes les statistiques et historiques pour le mois sélectionné
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Rapports;
