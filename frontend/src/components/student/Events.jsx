import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Stack,
  Avatar,
  alpha,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const EventCard = styled(Card)(({ theme }) => ({
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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    const res = await api.get('/events');
    setEvents(res.data);
  };

  const registerEvent = async (id) => {
    try {
      await api.post(`/events/register/${id}`);
      setMessage('Registered successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Box
      sx={{
        py: 6,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
            Upcoming Events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register for networking and mentorship events
          </Typography>
        </Stack>

        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {events.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            No events available at the moment.
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
                        <Stack direction="row" spacing={2} alignItems="flex-start">
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
                                Join Meeting
                              </a>
                            </Stack>
                          )}
                        </Stack>

                        {/* Register Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => registerEvent(event._id)}
                          sx={{
                            bgcolor: '#FF9800',
                            '&:hover': { bgcolor: '#F57C00' },
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Register
                        </Button>
                      </Stack>
                    </CardContent>
                  </EventCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Events;
