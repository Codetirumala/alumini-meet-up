import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  Badge,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listen for unread messages
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token }
      });

      socket.on('authenticated', () => {
        // Request unread messages count
        socket.emit('getUnreadCount');
      });

      socket.on('unreadMessages', (messages) => {
        setUnreadCount(messages.length);
      });

      socket.on('receiveMessage', (data) => {
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'alumni') return '/alumni';
    if (user?.role === 'student') return '/student';
    return '/';
  };

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Dashboard', icon: <DashboardIcon />, path: getDashboardPath(), show: !!user },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1300,
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, px: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                },
              }}
            >
              <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Alumni Hub
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                Connect • Grow • Succeed
              </Typography>
            </Box>
          </motion.div>

          {isMobile ? (
            <IconButton
              edge="end"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ 
                color: '#10B981',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.08)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              {navItems.map((item) => (
                item.show !== false && (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: '#1F2937',
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        px: 2.5,
                        py: 1,
                        borderRadius: '10px',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.08)',
                          color: '#10B981',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 8,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '0%',
                          height: '3px',
                          background: 'linear-gradient(90deg, #10B981, #059669)',
                          borderRadius: '2px',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '60%',
                        },
                      }}
                      startIcon={item.icon}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                )
              ))}

              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box display="flex" alignItems="center" gap={2} ml={2}>
                    {/* Messages Badge */}
                    <Badge 
                      badgeContent={unreadCount} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#EF4444',
                          color: '#EF4444',
                          boxShadow: '0 0 0 2px white',
                          animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                          },
                        },
                      }}
                    >
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#10B981',
                          '&:hover': {
                            background: 'rgba(16, 185, 129, 0.08)',
                          },
                        }}
                      >
                        <MailIcon />
                      </IconButton>
                    </Badge>
                    <Avatar
                      onClick={handleMenuOpen}
                      sx={{
                        width: 42,
                        height: 42,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                        },
                        border: '2px solid white',
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      px: 3.5,
                      py: 1.2,
                      ml: 1,
                      borderRadius: '10px',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            mt: 1,
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MenuItem disabled>
            <Avatar
              sx={{
                mr: 2,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                width: 40,
                height: 40,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          {user?.role === 'admin' && (
            <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
              <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
              Admin Dashboard
            </MenuItem>
          )}
          {user?.role === 'alumni' && (
            <MenuItem onClick={() => { navigate('/alumni'); handleMenuClose(); }}>
              <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
              Alumni Dashboard
            </MenuItem>
          )}
          {user?.role === 'student' && (
            <MenuItem onClick={() => { navigate('/student'); handleMenuClose(); }}>
              <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
              Student Dashboard
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </motion.div>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '300px',
            backgroundColor: '#f5f7fa',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {user && (
            <Box sx={{ mb: 2, p: 2, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '12px', color: 'white', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  background: 'rgba(255, 255, 255, 0.25)',
                  mb: 1,
                  border: '3px solid white',
                  fontWeight: 700,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography variant="caption">
                {user.role}
              </Typography>
            </Box>
          )}
          {navItems.map((item) =>
            item.show !== false && (
              <MenuItem
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{ borderRadius: '8px', mb: 1 }}
              >
                {item.icon}
                <Typography sx={{ ml: 2 }}>{item.label}</Typography>
              </MenuItem>
            )
          )}
          <Divider sx={{ my: 2 }} />
          {user ? (
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: '8px' }}
            >
              Logout
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                navigate('/login');
                setMobileOpen(false);
              }}
              sx={{ 
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                fontWeight: 700,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
