import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('OTP sent to your email. Check your inbox.');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
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
                Reset Password
              </Typography>
              <Typography variant="body2" color="#6b7280" sx={{ mb: 2, fontWeight: 500 }}>
                Enter your email to receive an OTP
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
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#10B981', mr: 1, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10B981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                      },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#9ca3af',
                      opacity: 1,
                    },
                  }}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.6,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    color: 'white',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                      transform: 'translateY(-2px)',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                    '&:disabled': {
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} color="inherit" />
                      Sending...
                    </Box>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </motion.div>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                onClick={() => navigate('/login')}
                startIcon={<ArrowBackIcon />}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#10B981',
                  textTransform: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(16, 185, 129, 0.08)',
                  },
                }}
              >
                Back to Sign In
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
