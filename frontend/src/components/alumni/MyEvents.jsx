import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  alpha,
  Divider,
  Badge,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const EventCard = styled(Card)(() => ({
  borderRadius: 16,
  background: '#ffffff',
  border: '1px solid rgba(2,6,23,0.06)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
}));

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events/my-events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      setMessage('Event deleted successfully');
      setOpenSnackbar(true);
      fetchMyEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete event');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      <Container maxWidth="lg">
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
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                My Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your event postings and registrations
              </Typography>
            </Box>
            <Chip
              label={`${events.length} Events`}
              sx={{
                bgcolor: alpha('#10B981', 0.15),
                color: '#047857',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2.5,
                px: 1,
              }}
            />
          </Stack>
        </Stack>

        {events.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            You haven't created any events yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {events.map((event, idx) => (
              <Grid item xs={12} md={6} key={event._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <EventCard>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        {/* Event Header */}
                        <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                            <Avatar sx={{ bgcolor: alpha('#FF9800', 0.15), color: '#E65100' }}>
                              <EventIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {event.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOnIcon sx={{ fontSize: 14, color: '#FF9800' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                  {event.locationMode}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Badge
                              badgeContent={event.participants?.length || 0}
                              color="success"
                              max={99}
                            >
                              <Avatar sx={{ bgcolor: alpha('#10B981', 0.1), color: '#047857', width: 36, height: 36 }}>
                                <PeopleIcon sx={{ fontSize: 20 }} />
                              </Avatar>
                            </Badge>
                            <IconButton
                              onClick={() => handleDelete(event._id)}
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  bgcolor: alpha('#ef4444', 0.1),
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Stack>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {event.description}
                        </Typography>

                        <Divider />

                        {/* Date and Time */}
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <EventIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(event.date)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.time}
                            </Typography>
                          </Stack>
                          {event.meetLink && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <LinkIcon sx={{ fontSize: 16, color: '#10B981' }} />
                              <a 
                                href={event.meetLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  color: '#10B981', 
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.875rem'
                                }}
                              >
                                Meeting Link
                              </a>
                            </Stack>
                          )}
                        </Stack>

                        <Divider />

                        {/* Participants Info */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PeopleIcon sx={{ fontSize: 18, color: '#FF9800' }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.participants?.length || 0} {event.participants?.length === 1 ? 'participant' : 'participants'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </EventCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyEvents;
