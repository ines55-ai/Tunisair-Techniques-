import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Fade,
  Badge,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Devices as DevicesIcon,
  Person as PersonIcon,
  MeetingRoom as MeetingRoomIcon,
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as SwapHorizIcon,
  Assessment as AssessmentIcon,
  QrCodeScanner as ScannerIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  ManageAccounts as ManageAccountsIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useAuth, useThemeMode } from '../../context';
import BrandLogo from '../common/BrandLogo';
import AccessibilityPanel from '../common/AccessibilityPanel';
import { APP_NAME } from '../../utils/constants';

const drawerWidth = 260;

const allMenuItems = [
  { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Matériels', icon: <DevicesIcon />, path: '/materiels' },
  { text: 'Scanner', icon: <ScannerIcon />, path: '/scanner' },
  { text: 'Agents', icon: <PersonIcon />, path: '/agents' },
  { text: 'Bureaux', icon: <MeetingRoomIcon />, path: '/bureaux' },
  { text: 'Stock', icon: <WarehouseIcon />, path: '/stock' },
  { text: 'Inventaires', icon: <InventoryIcon />, path: '/inventaires' },
  { text: 'Mouvements', icon: <SwapHorizIcon />, path: '/mouvements' },
  { text: 'Rapports', icon: <AssessmentIcon />, path: '/rapports' },
  { text: 'Utilisateurs', icon: <ManageAccountsIcon />, path: '/utilisateurs', adminOnly: true },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [a11yOpen, setA11yOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeMode();

  // Filtrer les items de menu selon le rôle
  const menuItems = allMenuItems.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  const userDisplayName = user?.prenom
    ? `${user.prenom} ${user.nom}`
    : user?.email || 'Utilisateur';

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', py: 2.5, px: 2 }}>
        <BrandLogo height={48} centered showAppName />
      </Toolbar>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 2 }} aria-label="Navigation principale">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleMenuClick(item.path)}
                aria-current={isSelected ? 'page' : undefined}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  transition: 'all 0.3s ease',
                  ...(isSelected && {
                    background: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #1B6CC8 0%, #5E4CC7 100%)'
                        : 'linear-gradient(135deg, #5B9FED 0%, #9B88FF 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(27, 108, 200, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1457A0 0%, #4A3BAA 100%)',
                    },
                  }),
                  ...(!isSelected && {
                    '&:hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(4px)',
                      '@media (prefers-reduced-motion: reduce)': {
                        transform: 'none',
                      },
                    },
                  }),
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? '#fff' : 'inherit',
                    minWidth: 40,
                  }}
                  aria-hidden="true"
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '0.95rem',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Skip navigation link — visible only on keyboard focus */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <AppBar
        component="header"
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <BrandLogo height={32} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 700 }}
            >
              {APP_NAME}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'block', sm: 'none' },
              fontWeight: 700,
            }}
          >
            {APP_NAME}
          </Typography>

          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              aria-label="Notifications (aucune nouvelle notification)"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Accessibilité">
            <IconButton
              color="inherit"
              onClick={() => setA11yOpen(true)}
              aria-label="Ouvrir le panneau d'accessibilité"
              aria-haspopup="dialog"
              sx={{
                mr: 1,
                background: (theme) => alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: (theme) => alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <AccessibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              mode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
            }
          >
            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              aria-label={
                mode === 'dark'
                  ? 'Activer le mode clair'
                  : 'Activer le mode sombre'
              }
              sx={{
                mr: 2,
                background: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Profil">
            <IconButton
              onClick={handleUserMenuOpen}
              aria-label={`Menu utilisateur — ${userDisplayName}`}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              aria-controls="user-menu"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                },
                px: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #1B6CC8 0%, #5E4CC7 100%)',
                  fontWeight: 700,
                }}
                aria-hidden="true"
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 600,
                }}
                aria-hidden="true"
              >
                {user?.email}
              </Typography>
            </IconButton>
          </Tooltip>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleUserMenuClose();
                navigate('/profile');
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mon Profil</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Déconnexion</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Navigation latérale"
      >
        <Drawer
          id="mobile-navigation-drawer"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        id="main-content"
        component="main"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          '&:focus': { outline: 'none' },
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Accessibility Panel */}
      <AccessibilityPanel open={a11yOpen} onClose={() => setA11yOpen(false)} />
    </Box>
  );
}

export default Layout;
