import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
  InputAdornment,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', form);
      setSuccess(
        form.role === 'alumni'
          ? 'Registration successful! Await admin approval.'
          : 'Registration successful! You can login now.'
      );

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              width: '100%',
              maxWidth: '420px',
              mx: 'auto',
              borderRadius: '20px',
              background: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.1)',
            }}
          >
            <Box textAlign="center" mb={3}>
              <motion.div 
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: '16px',
                    mb: 2,
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 36 }} />
                </Box>
              </motion.div>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                  color: '#1f2937',
                }}
              >
                Alumni Hub
              </Typography>
              <Typography variant="body2" color="#6b7280" sx={{ mb: 2, fontWeight: 500 }}>
                Create your account
              </Typography>
            </Box>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    background: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                  }} 
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  {success}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#10B981', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#10B981', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon sx={{ color: '#10B981', mr: 1 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ 
                            color: '#10B981', 
                            minWidth: 'auto', 
                            p: 0.5,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '&:hover': {
                              background: 'rgba(16, 185, 129, 0.08)',
                            },
                          }}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Role Selection */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Register As"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: '#10B981', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                      },
                    },
                  }}
                >
                  <MenuItem value="student">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: 18 }} />
                      Student
                    </Box>
                  </MenuItem>
                  <MenuItem value="alumni">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon sx={{ fontSize: 18 }} />
                      Alumni
                    </Box>
                  </MenuItem>
                </TextField>
              </motion.div>

              {/* Register Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  endIcon={loading ? undefined : <ArrowForwardIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} color="inherit" />
                      Creating...
                    </Box>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.div>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="#6b7280" sx={{ mb: 1 }}>
                Already have an account?
              </Typography>
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#10B981',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#059669',
                  },
                }}
              >
                Sign In →
              </Link>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};
export default Register;
