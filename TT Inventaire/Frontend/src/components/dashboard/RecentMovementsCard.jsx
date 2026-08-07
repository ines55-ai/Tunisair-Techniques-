import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Typography,
  CircularProgress,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import {
  AssignmentInd as AffectationIcon,
  SwapHoriz as TransfertIcon,
  Build as MaintenanceIcon,
  KeyboardReturn as RetourIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { mouvementService } from '../../services/mouvementService';
import { useNavigate } from 'react-router-dom';

/**
 * Carte affichant les derniers mouvements
 */
function RecentMovementsCard() {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentMovements();
  }, []);

  const fetchRecentMovements = async () => {
    try {
      setLoading(true);
      const response = await mouvementService.getAll(1, 5);
      setMouvements(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'AFFECTATION':
        return <AffectationIcon />;
      case 'TRANSFERT':
        return <TransfertIcon />;
      case 'MAINTENANCE':
        return <MaintenanceIcon />;
      case 'RETOUR':
        return <RetourIcon />;
      default:
        return <AffectationIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'AFFECTATION':
        return 'primary';
      case 'TRANSFERT':
        return 'info';
      case 'MAINTENANCE':
        return 'warning';
      case 'RETOUR':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      AFFECTATION: 'Affectation',
      TRANSFERT: 'Transfert',
      MAINTENANCE: 'Maintenance',
      RETOUR: 'Retour',
      REFORME: 'Réforme',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title="Derniers Mouvements" />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Derniers Mouvements"
        subheader="Activité récente sur les matériels"
        action={
          <IconButton onClick={() => navigate('/mouvements')}>
            <MoreIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {mouvements.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucun mouvement récent
            </Typography>
          </Box>
        ) : (
          <List>
            {mouvements.map((mouvement, index) => (
              <ListItem
                key={mouvement.id}
                divider={index < mouvements.length - 1}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => navigate(`/mouvements/${mouvement.id}`)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getTypeColor(mouvement.typeMouvement)}.lighter` }}>
                    {getTypeIcon(mouvement.typeMouvement)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={mouvement.materiel?.nom || 'Matériel inconnu'}
                  secondary={
                    <>
                      {mouvement.typeMouvement === 'TRANSFERT' && mouvement.agentSource && mouvement.agentDest
                        ? `${mouvement.agentSource.nom} → ${mouvement.agentDest.nom} • `
                        : mouvement.agentDest
                        ? `Vers ${mouvement.agentDest.nom} ${mouvement.agentDest.prenom} • `
                        : mouvement.agentSource
                        ? `De ${mouvement.agentSource.nom} ${mouvement.agentSource.prenom} • `
                        : ''}
                      {formatDate(mouvement.date)}
                    </>
                  }
                />
                <Chip
                  label={getTypeLabel(mouvement.typeMouvement)}
                  size="small"
                  color={getTypeColor(mouvement.typeMouvement)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentMovementsCard;
