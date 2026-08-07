import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  AssignmentInd as AffectationIcon,
  SwapHoriz as TransfertIcon,
  Build as MaintenanceIcon,
  KeyboardReturn as RetourIcon,
  DeleteForever as ReformeIcon,
  Error as PanneIcon,
} from '@mui/icons-material';
import { mouvementService } from '../../services/mouvementService';

/**
 * Timeline affichant l'historique complet des mouvements d'un matériel
 */
function HistoriqueTimeline({ materielId }) {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (materielId) {
      fetchHistorique();
    }
  }, [materielId]);

  const fetchHistorique = async () => {
    try {
      setLoading(true);
      // Récupérer tous les mouvements du matériel, triés par date décroissante
      const data = await mouvementService.getByMateriel(materielId);
      setMouvements(data);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
      setError('Impossible de charger l\'historique');
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
      case 'REFORME':
        return <ReformeIcon />;
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
      case 'REFORME':
        return 'error';
      default:
        return 'grey';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'AFFECTATION':
        return 'Affectation';
      case 'TRANSFERT':
        return 'Transfert';
      case 'MAINTENANCE':
        return 'Maintenance';
      case 'RETOUR':
        return 'Retour';
      case 'REFORME':
        return 'Réforme';
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (mouvements.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Aucun mouvement enregistré pour ce matériel
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Historique Complet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {mouvements.length} mouvement(s) enregistré(s)
      </Typography>

      <Timeline position="right">
        {mouvements.map((mouvement, index) => (
          <TimelineItem key={mouvement.id}>
            <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
              <Typography variant="body2" fontWeight="bold">
                {formatDate(mouvement.date)}
              </Typography>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot color={getTypeColor(mouvement.typeMouvement)}>
                {getTypeIcon(mouvement.typeMouvement)}
              </TimelineDot>
              {index < mouvements.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={getTypeLabel(mouvement.typeMouvement)}
                    color={getTypeColor(mouvement.typeMouvement)}
                    size="small"
                  />
                  {mouvement.cloture && (
                    <Chip label="Clôturé" size="small" variant="outlined" />
                  )}
                </Box>

                {/* Affichage selon le type de mouvement */}
                {mouvement.typeMouvement === 'AFFECTATION' && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Agent:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mouvement.agentDest
                        ? `${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`
                        : 'Non spécifié'}
                    </Typography>
                  </Box>
                )}

                {mouvement.typeMouvement === 'TRANSFERT' && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      De:
                    </Typography>
                    <Typography variant="body1">
                      {mouvement.agentSource
                        ? `${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`
                        : 'Non spécifié'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Vers:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mouvement.agentDest
                        ? `${mouvement.agentDest.nom} ${mouvement.agentDest.prenom}`
                        : 'Non spécifié'}
                    </Typography>
                  </Box>
                )}

                {mouvement.typeMouvement === 'MAINTENANCE' && (
                  <Box>
                    <Typography variant="body2" color="warning.main">
                      Matériel en maintenance
                    </Typography>
                    {mouvement.dateRetourPrevue && (
                      <Typography variant="caption" color="text.secondary">
                        Retour prévu: {formatDate(mouvement.dateRetourPrevue)}
                      </Typography>
                    )}
                  </Box>
                )}

                {mouvement.typeMouvement === 'RETOUR' && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Retour de:
                    </Typography>
                    <Typography variant="body1">
                      {mouvement.agentSource
                        ? `${mouvement.agentSource.nom} ${mouvement.agentSource.prenom}`
                        : 'Non spécifié'}
                    </Typography>
                  </Box>
                )}

                {mouvement.description && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Description:
                    </Typography>
                    <Typography variant="body2">{mouvement.description}</Typography>
                  </>
                )}

                {mouvement.remarques && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Remarques:
                    </Typography>
                    <Typography variant="body2">{mouvement.remarques}</Typography>
                  </>
                )}

                {mouvement.effectuePar && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Effectué par: {mouvement.effectuePar}
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}

export default HistoriqueTimeline;
