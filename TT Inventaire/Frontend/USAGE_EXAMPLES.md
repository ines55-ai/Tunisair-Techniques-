# 📚 Exemples d'Utilisation - Composants Modernes

## 🎨 Exemples Pratiques

### 1. Page Complète avec Animation

```jsx
import { Container, Typography, Grid } from '@mui/material';
import { AnimatedPage, ModernCard, GradientButton } from '../components/ui';

function MyPage() {
  return (
    <AnimatedPage animation="fade" timeout={600}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Ma Page Moderne
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <ModernCard variant="gradient" color="primary" title="Statistiques">
              <Typography>Contenu de la carte</Typography>
            </ModernCard>
          </Grid>
        </Grid>

        <GradientButton variant="primary" sx={{ mt: 3 }}>
          Action Principale
        </GradientButton>
      </Container>
    </AnimatedPage>
  );
}

export default MyPage;
```

---

### 2. Formulaire Moderne

```jsx
import { useState } from 'react';
import { Box, TextField, Stack } from '@mui/material';
import { ModernCard, GradientButton } from '../components/ui';
import { Save as SaveIcon } from '@mui/icons-material';

function ModernForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ... logique de soumission
    setLoading(false);
  };

  return (
    <ModernCard variant="elevated" title="Formulaire" color="primary">
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'light' ? '#f8fafc' : '#1c2128',
                },
              },
            }}
          />

          <TextField
            fullWidth
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <GradientButton
            type="submit"
            variant="primary"
            loading={loading}
            startIcon={<SaveIcon />}
            fullWidth
          >
            Enregistrer
          </GradientButton>
        </Stack>
      </Box>
    </ModernCard>
  );
}

export default ModernForm;
```

---

### 3. Liste avec Cartes Animées

```jsx
import { Grid, Grow, Typography, Box, Chip } from '@mui/material';
import { ModernCard } from '../components/ui';
import { Computer as ComputerIcon } from '@mui/icons-material';

function MaterialsList({ materiels }) {
  return (
    <Grid container spacing={3}>
      {materiels.map((materiel, index) => (
        <Grid item xs={12} sm={6} md={4} key={materiel.id}>
          <Grow in timeout={600 + index * 100}>
            <div>
              <ModernCard variant="gradient" color="primary" hover>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ComputerIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {materiel.nom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {materiel.marque}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={materiel.statut}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    color: 'white',
                  }}
                />
              </ModernCard>
            </div>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );
}

export default MaterialsList;
```

---

### 4. Statistiques avec Gradients

```jsx
import { Box, Typography, Grid, alpha, useTheme } from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

function StatsOverview({ stats }) {
  const theme = useTheme();

  const StatBox = ({ icon: Icon, label, value, color }) => (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
        border: '2px solid',
        borderColor: alpha(theme.palette[color].main, 0.3),
        borderRadius: 3,
        background: alpha(theme.palette[color].main, 0.05),
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.2)}`,
        },
      }}
    >
      <Icon color={color} sx={{ fontSize: 48, mb: 1.5 }} />
      <Typography variant="h3" color={`${color}.main`} fontWeight={800}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatBox
          icon={ComputerIcon}
          label="Total Matériels"
          value={stats.total}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatBox
          icon={CheckCircleIcon}
          label="En Service"
          value={stats.enService}
          color="success"
        />
      </Grid>
      {/* ... autres stats */}
    </Grid>
  );
}

export default StatsOverview;
```

---

### 5. Boutons d'Actions Multiples

```jsx
import { Stack } from '@mui/material';
import { GradientButton } from '../components/ui';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

function ActionButtons({ onSave, onDelete, onEdit, onRefresh, loading }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <GradientButton
        variant="primary"
        startIcon={<SaveIcon />}
        onClick={onSave}
        loading={loading.save}
      >
        Enregistrer
      </GradientButton>

      <GradientButton
        variant="secondary"
        startIcon={<EditIcon />}
        onClick={onEdit}
        disabled={loading.save}
      >
        Modifier
      </GradientButton>

      <GradientButton
        variant="error"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
        disabled={loading.save}
      >
        Supprimer
      </GradientButton>

      <GradientButton
        variant="info"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        size="small"
        sx={{
          '& .MuiButton-startIcon': {
            transition: 'transform 0.5s ease',
          },
          '&:hover .MuiButton-startIcon': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        Actualiser
      </GradientButton>
    </Stack>
  );
}

export default ActionButtons;
```

---

### 6. Modal Moderne

```jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { GradientButton } from '../components/ui';

function ModernDialog({ open, onClose, title, children, onConfirm, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(22, 27, 34, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 700,
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <GradientButton
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </GradientButton>
        <GradientButton
          variant="primary"
          onClick={onConfirm}
          loading={loading}
        >
          Confirmer
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default ModernDialog;
```

---

### 7. Tableau de Bord avec Animations

```jsx
import { useState, useEffect } from 'react';
import { Container, Grid, Fade, Grow } from '@mui/material';
import { AnimatedPage, ModernCard } from '../components/ui';

function AnimatedDashboard() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <AnimatedPage animation="fade" timeout={600}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Alertes */}
        <Fade in={showContent} timeout={800}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Contenu alertes */}
          </Grid>
        </Fade>

        {/* Statistiques */}
        <Grid container spacing={3}>
          {[0, 1, 2, 3].map((index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={showContent} timeout={600 + index * 200}>
                <div>
                  <ModernCard variant="gradient" color="primary">
                    {/* Contenu statistique */}
                  </ModernCard>
                </div>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

export default AnimatedDashboard;
```

---

### 8. Barre de Progression Stylisée

```jsx
import { Box, Typography, LinearProgress, alpha, useTheme } from '@mui/material';

function ModernProgressBar({ label, value, color = 'primary' }) {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700} color={`${color}.main`}>
          {value}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: alpha(theme.palette[color].main, 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            background: `linear-gradient(90deg, ${theme.palette[color].light} 0%, ${theme.palette[color].main} 100%)`,
            boxShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.3)}`,
          },
        }}
      />
    </Box>
  );
}

export default ModernProgressBar;
```

---

### 9. Badge/Chip Moderne

```jsx
import { Chip, alpha } from '@mui/material';

function ModernChip({ label, color = 'primary', icon, onClick }) {
  return (
    <Chip
      label={label}
      icon={icon}
      onClick={onClick}
      sx={{
        fontWeight: 600,
        borderRadius: 2,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark || theme.palette[color].main} 100%)`,
        color: 'white',
        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette[color].main, 0.3)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette[color].main, 0.5)}`,
        },
      }}
    />
  );
}

export default ModernChip;
```

---

### 10. Section avec Titre Stylisé

```jsx
import { Box, Typography, Divider } from '@mui/material';

function ModernSection({ title, subtitle, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {subtitle}
          </Typography>
        )}
        <Divider sx={{ mt: 2, mb: 3 }} />
      </Box>
      {children}
    </Box>
  );
}

export default ModernSection;
```

---

## 💡 Conseils d'Utilisation

1. **Toujours importer depuis ui/index.js**
   ```jsx
   import { GradientButton, ModernCard } from '../components/ui';
   ```

2. **Combiner les animations**
   - Fade pour les conteneurs
   - Grow pour les cartes individuelles
   - Délais progressifs pour les listes

3. **Utiliser les couleurs du thème**
   ```jsx
   color="primary" // ✅
   color="#1976d2" // ❌
   ```

4. **Appliquer les gradients de manière cohérente**
   - Titres importants
   - Boutons d'action principales
   - Éléments de mise en évidence

5. **Ne pas surcharger les animations**
   - Maximum 3-4 animations par page
   - Durées entre 300ms et 800ms
   - Toujours cubic-bezier pour la fluidité

---

**Besoin d'aide ?** Consultez le `STYLE_GUIDE.md` pour plus d'exemples !
