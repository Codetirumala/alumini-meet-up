import { Container, Typography, Grid, Box, Card, CardContent, Button, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../../api/axios';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    studentsConnected: 0,
    jobsPosted: 0,
    eventsHosted: 0,
    profileStrength: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/alumni/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'My Profile',
      description: 'Create, update your professional profile Asap',
      icon: <PersonIcon sx={{ fontSize: 64 }} />,
      color: '#1976d2',
      path: '/alumni/profile',
      action: 'Edit Profile',
    },
    {
      title: 'Post Jobs',
      description: 'Offer more job opportunities to the students easily ',
      icon: <WorkIcon sx={{ fontSize: 64 }} />,
      color: '#2e7d32',
      path: '/alumni/jobs',
      action: 'Post a Job',
    },
    {
      title: 'My Posted Jobs',
      description: 'View your job postings and applicants seamlessly',
      icon: <WorkIcon sx={{ fontSize: 64 }} />,
      color: '#10B981',
      path: '/alumni/my-jobs',
      action: 'View My Jobs',
    },
    {
      title: 'Create Events',
      description: 'Organize networking and mentorship events',
      icon: <EventIcon sx={{ fontSize: 64 }} />,
      color: '#f57c00',
      path: '/alumni/events',
      action: 'Schedule Event',
    },
    {
      title: 'My Events',
      description: 'View events you have created and manage them',
      icon: <EventIcon sx={{ fontSize: 64 }} />,
      color: '#FF9800',
      path: '/alumni/my-events',
      action: 'View My Events',
    },
    {
      title: 'My Connections',
      description: 'View student connection requests and messages',
      icon: <PeopleIcon sx={{ fontSize: 64 }} />,
      color: '#10B981',
      path: '/alumni/connections',
      action: 'View Connections',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Alumni Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Manage your profile, post opportunities, and mentor the next generation
            </Typography>
          </Box>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      borderTop: `6px solid ${feature.color}`,
                      borderRadius: '16px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: -50,
                        width: 100,
                        height: 100,
                        background: alpha(feature.color, 0.1),
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                      },
                      '&:hover': {
                        boxShadow: `0 16px 40px ${alpha(feature.color, 0.2)}`,
                        transform: 'translateY(-8px)',
                        '&::before': {
                          right: -20,
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ 
                      position: 'relative', 
                      zIndex: 1, 
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      height: '100%'
                    }}>
                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            background: alpha(feature.color, 0.1),
                            borderRadius: '16px',
                            mb: 2.5,
                            color: feature.color,
                          }}
                        >
                          {feature.icon}
                        </Box>

                        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
                          {feature.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3, flexGrow: 1 }}>
                          {feature.description}
                        </Typography>
                      </Box>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(feature.path)}
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            background: feature.color,
                            color: 'white',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: '8px',
                            py: 1.5,
                            '&:hover': {
                              background: feature.color,
                              boxShadow: `0 8px 16px ${alpha(feature.color, 0.3)}`,
                            },
                          }}
                        >
                          {feature.action}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: 60,
                  height: 4,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  borderRadius: '2px',
                  mt: 1,
                },
              }}
            >
              Your Impact
            </Typography>

            <Grid container spacing={3}>
              {[
                { label: 'Students Connected', value: stats.studentsConnected, color: '#1976d2' },
                { label: 'Jobs Posted', value: stats.jobsPosted, color: '#2e7d32' },
                { label: 'Events Hosted', value: stats.eventsHosted, color: '#f57c00' },
                { label: 'Profile Strength', value: `${stats.profileStrength}%`, color: '#d32f2f' },
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        borderTop: `4px solid ${stat.color}`,
                        background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(
                          stat.color,
                          0.02
                        )} 100%)`,
                        '&:hover': {
                          boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                        },
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AlumniDashboard;
