import { useEffect, useRef } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/common/BrandLogo';

function NotFound() {
  const navigate = useNavigate();
  const headingRef = useRef(null);

  // Déplace le focus sur le titre dès l'arrivée sur la page 404
  // afin que les lecteurs d'écran annoncent immédiatement l'erreur
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <BrandLogo height={90} centered sx={{ mb: 2 }} />

        {/* tabIndex={-1} permet le focus programmatique sans être dans l'ordre Tab */}
        <Typography
          ref={headingRef}
          tabIndex={-1}
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ '&:focus': { outline: 'none' } }}
        >
          404
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Page non trouvée
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          La page que vous recherchez n'existe pas.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          aria-label="Retourner à la page d'accueil"
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
