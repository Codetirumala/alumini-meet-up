import { Container, Typography, Grid, Paper, Box, Button, Card, CardContent, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: 'My Profile',
      description: 'Manage your student profile',
      icon: <PersonIcon sx={{ fontSize: 64 }} />,
      color: '#10B981',
      path: '/student/profile',
      stat: 'Complete',
      statLabel: 'Your details',
    },
    {
      title: 'Alumni Directory',
      description: 'Connect with experienced professionals',
      icon: <PeopleIcon sx={{ fontSize: 64 }} />,
      color: '#1976d2',
      path: '/student/alumni',
      stat: '500+',
      statLabel: 'Alumni',
    },
    {
      title: 'Job Opportunities',
      description: 'Explore career opportunities',
      icon: <WorkIcon sx={{ fontSize: 64 }} />,
      color: '#2e7d32',
      path: '/student/jobs',
      stat: '150+',
      statLabel: 'Active Jobs',
    },
    {
      title: 'Events',
      description: 'Join networking and learning events',
      icon: <EventIcon sx={{ fontSize: 64 }} />,
      color: '#f57c00',
      path: '/student/events',
      stat: '20+',
      statLabel: 'Monthly Events',
    },
    {
      title: 'Mentorship',
      description: 'Request guidance from alumni',
      icon: <SchoolIcon sx={{ fontSize: 64 }} />,
      color: '#6366F1',
      path: '/student/mentorship',
      stat: 'High',
      statLabel: 'Impact',
    },
    {
      title: 'Resume Resources',
      description: 'Templates and interview tips',
      icon: <DescriptionIcon sx={{ fontSize: 64 }} />,
      color: '#22C55E',
      path: '/student/resources',
      stat: 'COMPLETE',
      statLabel: 'Materials',
    },
    {
      title: 'Notifications',
      description: 'Stay updated on responses',
      icon: <NotificationsActiveIcon sx={{ fontSize: 64 }} />,
      color: '#EF4444',
      path: '/student/notifications',
      stat: 'Live',
      statLabel: 'Updates',
    },
    {
      title: 'Saved Items',
      description: 'Quick access to saved content',
      icon: <BookmarkIcon sx={{ fontSize: 64 }} />,
      color: '#0EA5E9',
      path: '/student/saved',
      stat: 'Easy',
      statLabel: 'Access',
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
              Student Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Explore opportunities and connect with our alumni network
            </Typography>
          </Box>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    onClick={() => navigate(feature.path)}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      background: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      borderTop: `6px solid ${feature.color}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                    <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          background: alpha(feature.color, 0.1),
                          borderRadius: '16px',
                          mb: 2,
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Box>

                      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                        {feature.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: feature.color }}>
                            {feature.stat}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {feature.statLabel}
                          </Typography>
                        </Box>
                        <Button
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            color: feature.color,
                            fontWeight: 700,
                            textTransform: 'none',
                            '&:hover': {
                              background: alpha(feature.color, 0.1),
                            },
                          }}
                        >
                          Explore
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mt: 8, mb: 4 }}>
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
              Community Stats
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { label: 'Active Alumni', value: '2,340+', color: '#1976d2' },
              { label: 'Job Placements', value: '85%', color: '#2e7d32' },
              { label: 'Mentorship Pairs', value: '450+', color: '#f57c00' },
              { label: 'Success Stories', value: '320+', color: '#d32f2f' },
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
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
