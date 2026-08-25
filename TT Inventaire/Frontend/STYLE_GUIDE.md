# 📐 Guide de Style UI - TT Inventaire

## 🎨 Utilisation du Thème

### Accéder aux couleurs du thème

```jsx
import { useTheme, alpha } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  
  // Utiliser les couleurs
  const primaryColor = theme.palette.primary.main;
  const backgroundColor = theme.palette.background.default;
  
  // Créer des couleurs transparentes
  const transparentPrimary = alpha(theme.palette.primary.main, 0.1);
  
  return (
    <Box sx={{ color: primaryColor, bgcolor: transparentPrimary }}>
      Contenu
    </Box>
  );
}
```

## 🎭 Composants Stylisés

### 1. Boutons Modernes

#### Bouton avec Gradient
```jsx
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    borderRadius: 2,
    px: 3,
    py: 1.2,
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
      transform: 'translateY(-2px)',
    },
  }}
>
  Action
</Button>
```

#### Bouton avec Icône Animée
```jsx
<Button
  startIcon={<RefreshIcon />}
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
</Button>
```

### 2. Cartes Élégantes

#### Carte Standard
```jsx
<Card
  sx={{
    borderRadius: 3,
    boxShadow: (theme) =>
      theme.palette.mode === 'light'
        ? '0 4px 20px rgba(0,0,0,0.06)'
        : '0 4px 20px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: (theme) =>
        theme.palette.mode === 'light'
          ? '0 8px 30px rgba(0,0,0,0.12)'
          : '0 8px 30px rgba(0,0,0,0.5)',
    },
  }}
>
  <CardContent>
    Contenu
  </CardContent>
</Card>
```

#### Carte avec Gradient
```jsx
<Card
  sx={{
    background: (theme) =>
      `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
    border: '1px solid',
    borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
    backdropFilter: 'blur(10px)',
  }}
>
  <CardContent>
    Contenu
  </CardContent>
</Card>
```

### 3. Textes avec Gradient

```jsx
<Typography
  variant="h4"
  sx={{
    fontWeight: 800,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Titre avec Gradient
</Typography>
```

### 4. Boîtes avec Effet Hover

```jsx
<Box
  sx={{
    p: 3,
    border: '2px solid',
    borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
    borderRadius: 3,
    background: (theme) => alpha(theme.palette.primary.main, 0.05),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: (theme) =>
        `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  }}
>
  Contenu
</Box>
```

### 5. Barres de Progression Stylisées

```jsx
<LinearProgress
  variant="determinate"
  value={75}
  sx={{
    height: 8,
    borderRadius: 4,
    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
  }}
/>
```

### 6. Chips Modernes

```jsx
<Chip
  label="Status"
  sx={{
    fontWeight: 600,
    borderRadius: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  }}
/>
```

### 7. Avatars avec Gradient

```jsx
<Avatar
  sx={{
    width: 48,
    height: 48,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    fontWeight: 700,
  }}
>
  TT
</Avatar>
```

## 🎬 Animations

### Fade In (Apparition)
```jsx
import { Fade } from '@mui/material';

<Fade in={true} timeout={800}>
  <div>
    Contenu qui apparaît en fondu
  </div>
</Fade>
```

### Grow (Zoom)
```jsx
import { Grow } from '@mui/material';

<Grow in={true} timeout={600}>
  <div>
    Contenu qui apparaît avec zoom
  </div>
</Grow>
```

### Slide (Glissement)
```jsx
import { Slide } from '@mui/material';

<Slide direction="up" in={true} timeout={500}>
  <div>
    Contenu qui glisse vers le haut
  </div>
</Slide>
```

### Animation CSS personnalisée
```jsx
<Box
  sx={{
    animation: 'fadeIn 0.6s ease-in-out',
    '@keyframes fadeIn': {
      from: {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  }}
>
  Contenu
</Box>
```

## 🎨 Gradients Prédéfinis

### Gradients de Couleurs

```jsx
// Violet
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

// Bleu
background: 'linear-gradient(135deg, #0061f2 0%, #3a86ff 100%)'

// Vert
background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'

// Rouge
background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)'

// Orange
background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'

// Cyan
background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)'
```

## 📏 Espacements Standards

```jsx
// Padding/Margin
px: 1  // 8px
px: 2  // 16px
px: 3  // 24px
px: 4  // 32px

// Border Radius
borderRadius: 1   // 8px (petit)
borderRadius: 2   // 12px (moyen)
borderRadius: 3   // 16px (grand)
borderRadius: 4   // 20px (très grand)
```

## 🎭 Effets Glassmorphism

```jsx
<Box
  sx={{
    background: (theme) =>
      theme.palette.mode === 'light'
        ? 'rgba(255, 255, 255, 0.8)'
        : 'rgba(22, 27, 34, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid',
    borderColor: (theme) =>
      theme.palette.mode === 'light'
        ? 'rgba(255, 255, 255, 0.3)'
        : 'rgba(255, 255, 255, 0.1)',
  }}
>
  Contenu avec effet verre
</Box>
```

## ⚡ Best Practices

### 1. Toujours utiliser les couleurs du thème
```jsx
// ❌ Mauvais
sx={{ color: '#1976d2' }}

// ✅ Bon
sx={{ color: 'primary.main' }}
```

### 2. Utiliser alpha() pour la transparence
```jsx
// ❌ Mauvais
sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)' }}

// ✅ Bon
sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
```

### 3. Préférer transform pour les animations
```jsx
// ✅ Performant (GPU accelerated)
sx={{
  transition: 'transform 0.3s ease',
  '&:hover': { transform: 'translateY(-4px)' }
}}

// ⚠️ Moins performant
sx={{
  transition: 'top 0.3s ease',
  '&:hover': { top: '-4px' }
}}
```

### 4. Grouper les états hover/focus
```jsx
sx={{
  transition: 'all 0.3s ease',
  '&:hover, &:focus': {
    transform: 'scale(1.05)',
    boxShadow: 3,
  },
}}
```

## 🌓 Support Mode Sombre

```jsx
sx={{
  bgcolor: (theme) =>
    theme.palette.mode === 'light' ? '#f5f7fa' : '#0d1117',
  color: (theme) =>
    theme.palette.mode === 'light' ? '#1e293b' : '#f8fafc',
}}
```

## 📱 Responsive Design

```jsx
sx={{
  // Mobile first
  fontSize: '1rem',
  padding: 2,
  
  // Tablette et plus
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.2rem',
    padding: 3,
  },
  
  // Desktop
  [theme.breakpoints.up('md')]: {
    fontSize: '1.5rem',
    padding: 4,
  },
}}
```

---

**Note** : Ce guide est un document vivant. N'hésitez pas à l'enrichir au fur et à mesure des nouveaux patterns découverts !
