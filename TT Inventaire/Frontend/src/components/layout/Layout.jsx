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
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useAuth, useThemeMode } from '../../context';
import BrandLogo from '../common/BrandLogo';
import { APP_NAME } from '../../utils/constants';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Matériels', icon: <DevicesIcon />, path: '/materiels' },
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
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 1.5 }}>
        <BrandLogo height={56} centered showAppName />
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <BrandLogo height={36} />
            <Typography variant="h6" noWrap component="div">
              {APP_NAME}
            </Typography>
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}>
            {APP_NAME}
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            <IconButton color="inherit" onClick={toggleColorMode} sx={{ mr: 1 }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={handleUserMenuOpen}
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
              {user?.email}
            </Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mon Profil</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
