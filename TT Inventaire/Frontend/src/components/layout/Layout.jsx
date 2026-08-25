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
} from '@mui/icons-material';
import { useAuth, useThemeMode } from '../../context';
import BrandLogo from '../common/BrandLogo';
import { APP_NAME } from '../../utils/constants';

const drawerWidth = 260;

const menuItems = [
  { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Matériels', icon: <DevicesIcon />, path: '/materiels' },
  { text: 'Scanner', icon: <ScannerIcon />, path: '/scanner' },
  { text: 'Agents', icon: <PersonIcon />, path: '/agents' },
  { text: 'Bureaux', icon: <MeetingRoomIcon />, path: '/bureaux' },
  { text: 'Stock', icon: <WarehouseIcon />, path: '/stock' },
  { text: 'Inventaires', icon: <InventoryIcon />, path: '/inventaires' },
  { text: 'Mouvements', icon: <SwapHorizIcon />, path: '/mouvements' },
  { text: 'Rapports', icon: <AssessmentIcon />, path: '/rapports' },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeMode();

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
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  transition: 'all 0.3s ease',
                  ...(isSelected && {
                    background: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)'
                        : 'linear-gradient(135deg, #5B9FED 0%, #9B88FF 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3A7BC8 0%, #6B5FD1 100%)',
                    },
                  }),
                  ...(!isSelected && {
                    '&:hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(4px)',
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? '#fff' : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.95rem',
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
      <AppBar
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
            aria-label="open drawer"
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
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
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
                  background: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)',
                  fontWeight: 700,
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 600,
                }}
              >
                {user?.email}
              </Typography>
            </IconButton>
          </Tooltip>

          <Menu
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
      >
        <Drawer
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
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
