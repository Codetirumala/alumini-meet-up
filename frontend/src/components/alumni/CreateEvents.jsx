import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axios';

const FormCard = styled('form')(({ theme }) => ({
  borderRadius: 16,
  background: '#ffffff',
  border: '1px solid rgba(2,6,23,0.06)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
  padding: 32,
}));

const CreateEvents = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    locationMode: '',
    meetLink: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.title || !form.description || !form.date || !form.time || !form.locationMode) {
      setError('All fields are required');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await api.post('/events', {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        locationMode: form.locationMode,
        meetLink: form.meetLink,
      });

      setSuccess('Event created successfully!');
      setOpenSnackbar(true);
      setForm({
        title: '',
        description: '',
        date: '',
        time: '',
        meetLink: '',
        locationMode: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 6,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/alumni')}
            sx={{
              color: '#10B981',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(16, 185, 129, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857', width: 48, height: 48 }}>
              <EventIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                Create Event
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize networking and mentorship events for students
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <FormCard onSubmit={handleSubmit}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Event Title */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}>
                Event Title <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="title"
                placeholder="e.g., Alumni Networking Meet 2025"
                value={form.title}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                  },
                }}
              />
            </Box>

            {/* Event Description */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}>
                Event Description <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Include the purpose of the event and what participants will gain (3-4 lines)
              </Typography>
              <TextField
                fullWidth
                name="description"
                placeholder="Describe the purpose and benefits of this event..."
                value={form.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                  },
                }}
              />
            </Box>

            {/* Event Date */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}>
                Event Date <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                  },
                }}
              />
            </Box>

            {/* Event Time */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}>
                Event Time <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="time"
                placeholder="e.g., 10:00 AM – 12:00 PM"
                value={form.time}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                  },
                }}
              />
            </Box>

            {/* Location / Mode */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}>
                Location / Mode <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="locationMode"
                  value={form.locationMode}
                  onChange={handleChange}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#10B981',
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Location / Mode</em>
                  </MenuItem>
                  <MenuItem value="College Auditorium">College Auditorium</MenuItem>
                  <MenuItem value="Online (Google Meet)">Online (Google Meet)</MenuItem>
                  <MenuItem value="Online (Zoom)">Online (Zoom)</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Meeting Link */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}>
                Meeting Link (Optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Provide Google Meet, Zoom, or any online meeting link
              </Typography>
              <TextField
                fullWidth
                name="meetLink"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={form.meetLink}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                  },
                }}
              />
            </Box>

            {/* 
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#10B981',
                '&:hover': { bgcolor: '#059669' },
                '&:disabled': { bgcolor: alpha('#10B981', 0.5) },
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                py: 1.5,
                mt: 2,
              }}
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </Stack>
        </FormCard>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
          <span style={{ color: '#ef4444' }}>*</span> Required fields
        </Typography>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEvents;
