import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Button,
  Paper,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import {
  QrCodeScanner as ScanIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { barcodeService } from '../../services/barcodeService';

function Scanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [materiel, setMateriel] = useState(null);
  const [error, setError] = useState(null);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = () => {
    setScanning(true);
    setError(null);
    setMateriel(null);

    const html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    html5QrcodeScanner.render(
      async (decodedText) => {
        // Stop scanning
        html5QrcodeScanner.clear();
        setScanning(false);

        try {
          // Try to extract numero de serie from the decoded text
          let numeroSerie = decodedText;
          
          // If it's a URL, extract the ID or numero from it
          if (decodedText.includes('/materiels/')) {
            const urlParts = decodedText.split('/');
            const id = urlParts[urlParts.length - 1];
            
            // If it's an ID number, we'll need to fetch it differently
            if (!isNaN(id)) {
              setError('Veuillez scanner un code-barres (numéro de série) au lieu du QR code');
              return;
            }
            numeroSerie = id;
          }

          // Fetch materiel data
          const data = await barcodeService.scanBarcode(numeroSerie);
          setMateriel(data);
        } catch (err) {
          console.error('Scan error:', err);
          setError('Matériel non trouvé ou erreur lors du scan');
        }
      },
      (errorMessage) => {
        // Handle scan errors silently (they occur frequently during scanning)
        console.debug('Scan error:', errorMessage);
      }
    );

    setScanner(html5QrcodeScanner);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
    setScanning(false);
  };

  const resetScanner = () => {
    setMateriel(null);
    setError(null);
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      EN_SERVICE: 'success',
      EN_PANNE: 'error',
      EN_MAINTENANCE: 'warning',
      EN_STOCK: 'info',
      REFORME: 'default',
    };
    return colors[statut] || 'default';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      EN_SERVICE: 'En service',
      EN_PANNE: 'En panne',
      EN_MAINTENANCE: 'En maintenance',
      EN_STOCK: 'En stock',
      REFORME: 'Réformé',
    };
    return labels[statut] || statut;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <ScanIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1">
              Scanner un Matériel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Scannez le code-barres ou le QR code d'un matériel
            </Typography>
          </Box>
        </Stack>

        {!scanning && !materiel && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ScanIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Prêt à scanner
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Cliquez sur le bouton ci-dessous pour activer la caméra et scanner un code-barres
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ScanIcon />}
                  onClick={startScanning}
                >
                  Démarrer le scan
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Comment scanner ?
                </Typography>
                <Typography variant="body2" component="div">
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Placez le code-barres ou QR code devant la caméra</li>
                    <li>Maintenez une distance de 10-20 cm</li>
                    <li>Assurez-vous d'avoir un bon éclairage</li>
                    <li>Le scan se fait automatiquement</li>
                  </ul>
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        )}

        {scanning && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Scan en cours...
                </Typography>
                <IconButton color="error" onClick={stopScanning}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box id="reader" sx={{ width: '100%' }} />
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {materiel && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                  Informations du Matériel
                </Typography>
                <IconButton color="primary" onClick={resetScanner} title="Nouveau scan">
                  <RefreshIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                    <Typography variant="caption" color="text.secondary">
                      Numéro de série
                    </Typography>
                    <Typography variant="h6">
                      {materiel.numeroSerie}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Désignation
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {materiel.nom}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Marque
                  </Typography>
                  <Typography variant="body1">
                    {materiel.marque || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Modèle
                  </Typography>
                  <Typography variant="body1">
                    {materiel.modele || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Catégorie
                  </Typography>
                  <Typography variant="body1">
                    {materiel.categorie?.nom || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Statut
                  </Typography>
                  <Box>
                    <Chip
                      label={getStatutLabel(materiel.statut)}
                      color={getStatutColor(materiel.statut)}
                      size="small"
                    />
                  </Box>
                </Grid>

                {materiel.agent && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Affecté à
                    </Typography>
                    <Typography variant="body1">
                      {materiel.agent.prenom} {materiel.agent.nom} ({materiel.agent.matricule})
                    </Typography>
                  </Grid>
                )}

                {materiel.bureau && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Bureau
                    </Typography>
                    <Typography variant="body1">
                      {materiel.bureau.nom} - {materiel.bureau.code}
                    </Typography>
                  </Grid>
                )}

                {materiel.numeroInventaire && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Numéro d'inventaire
                    </Typography>
                    <Typography variant="body1">
                      {materiel.numeroInventaire}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={resetScanner}
                  startIcon={<RefreshIcon />}
                >
                  Nouveau scan
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/materiels/${materiel.id}`)}
                  startIcon={<InfoIcon />}
                >
                  Voir détails
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default Scanner;
