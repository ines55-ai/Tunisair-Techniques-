import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling
      setFormData({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: API call to update profile
      // await authService.updateProfile(formData);
      
      // Update local user data
      updateUser({ ...user, ...formData });
      
      setSnackbar({
        open: true,
        message: 'Profil mis à jour avec succès',
        severity: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour du profil',
        severity: 'error',
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Les mots de passe ne correspondent pas',
        severity: 'error',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Le mot de passe doit contenir au moins 6 caractères',
        severity: 'error',
      });
      return;
    }

    try {
      // TODO: API call to change password
      // await authService.changePassword(passwordData);
      
      setSnackbar({
        open: true,
        message: 'Mot de passe modifié avec succès',
        severity: 'success',
      });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors du changement de mot de passe',
        severity: 'error',
      });
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    const firstInitial = user.prenom?.[0] || '';
    const lastInitial = user.nom?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mon Profil
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Gérez vos informations personnelles et vos paramètres de compte
        </Typography>

        {/* Profile Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  bgcolor: 'primary.main',
                  mr: 3,
                }}
              >
                {getInitials()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {user?.prenom} {user?.nom}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    icon={<EmailIcon />}
                    label={user?.email}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<AdminIcon />}
                    label={user?.role || 'Utilisateur'}
                    color="primary"
                    size="small"
                  />
                </Stack>
              </Box>
              {!isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditToggle}
                >
                  Modifier
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleEditToggle}
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                >
                  Enregistrer
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon /> Sécurité
              </Typography>
              {!isChangingPassword && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Changer le mot de passe
                </Button>
              )}
            </Box>

            {isChangingPassword ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mot de passe actuel"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nouveau mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirmer le nouveau mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button variant="contained" onClick={handleChangePassword}>
                    Modifier le mot de passe
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Protégez votre compte en utilisant un mot de passe fort et unique
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Snackbar for notifications */}
        {snackbar.open && (
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ mt: 2 }}
          >
            {snackbar.message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default Profile;
