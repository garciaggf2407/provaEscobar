import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  useTheme,
  Modal,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { styled } from '@mui/material/styles';

const drawerWidth = 300;
const closedDrawerWidth = 56;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: closedDrawerWidth,
  }),
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    ...(open && {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    ...(!open && {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: closedDrawerWidth,
    }),
  }
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64,
  backgroundColor: theme.palette.background.default,
  minHeight: 'calc(100vh - 64px)',
  marginLeft: 0,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: closedDrawerWidth,
    width: `calc(100% - ${closedDrawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  })
}));

const Logo = styled(Typography)({
  fontWeight: 700,
  letterSpacing: '2px',
  cursor: 'pointer',
});

function Layout() {
  const [open, setOpen] = useState(true);
  const { authInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  console.log('Auth Info in Layout:', authInfo);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    ...(authInfo.token ? [{ text: 'Dashboard Admin', icon: <DashboardIcon />, path: '/admin' }] : []),
    { text: 'Carrinho', icon: <CartIcon />, path: '/cart' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        {open && (
          <Logo variant="h6" onClick={() => navigate('/')}>
            Minha Loja
          </Logo>
        )}
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
            }}
            selected={location.pathname === item.path}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...(open && {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
        ...(!open && {
          width: `calc(100% - ${closedDrawerWidth}px)`,
          marginLeft: closedDrawerWidth,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {!open && (
             <Logo variant="h6" onClick={() => navigate('/')} sx={{ flexGrow: 1 }}>
               ML
             </Logo>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {authInfo.token && (
             <Typography variant="body1" sx={{ mr: 2 }}>Olá, {authInfo.usuario || 'usuário'}</Typography>
          )}

          <IconButton color="inherit" onClick={() => !authInfo.token && navigate('/app/login')}>
             <PersonIcon />
          </IconButton>


          <IconButton color="inherit" sx={{ ml: 2 }} onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartItems.length} color="error">
              <CartIcon />
            </Badge>
          </IconButton>

          {authInfo.token && (
             <IconButton color="inherit" sx={{ ml: 2 }} onClick={() => setOpenLogoutModal(true)}>
                <LogoutIcon />
             </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer - Mini variant when closed */}
      <StyledDrawer variant="permanent" open={open} anchor="left">
         {drawer}
         <Box sx={{ flexGrow: 1 }} /> {/* Empurra o ícone de fechar para o fundo */}
         <List>
           <ListItem button onClick={handleDrawerClose} sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
           }}>
             <ListItemIcon
               sx={{
                 minWidth: 0,
                 mr: open ? 3 : 'auto',
                 justifyContent: 'center',
               }}
             >
               {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
             </ListItemIcon>
             {open && <ListItemText primary="Fechar Menu" sx={{ opacity: open ? 1 : 0 }} />}
           </ListItem>
         </List>
      </StyledDrawer>

      <Main open={open}>
        <Outlet /> {/* Renderiza o conteúdo da rota */}
      </Main>

       {/* Modal de Confirmação de Logout */}
       <Modal
         open={openLogoutModal}
         onClose={() => setOpenLogoutModal(false)}
         aria-labelledby="logout-modal-title"
         aria-describedby="logout-modal-description"
       >
         <Box sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: 400,
           bgcolor: 'background.paper',
           boxShadow: 24,
           p: 4,
           textAlign: 'center',
         }}>
           <Typography id="logout-modal-title" variant="h6" component="h2">
             Confirmar Logout
           </Typography>
           <Typography id="logout-modal-description" sx={{ mt: 2 }}>
             Tem certeza que deseja sair?
           </Typography>
           <Box sx={{ mt: 3 }}>
             <Button onClick={() => setOpenLogoutModal(false)} sx={{ mr: 2 }}>Cancelar</Button>
             <Button onClick={() => { setOpenLogoutModal(false); logout(); }} variant="contained" color="error">Sair</Button>
           </Box>
         </Box>
       </Modal>

    </Box>
  );
}

export default Layout; 