import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/common/BrandLogo';

function NotFound() {
  const navigate = useNavigate();

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
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Page non trouvée
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          La page que vous recherchez n'existe pas.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
