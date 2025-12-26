import { Container, Typography, Grid, Box, Card, CardContent, Button, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Manage Users',
      description: 'Approve alumni accounts and manage user access',
      icon: <PeopleIcon sx={{ fontSize: 64 }} />,
      color: '#1976d2',
      path: '/admin/users',
      action: 'View Users',
      count: '24 Pending',
    },
    {
      title: 'System Overview',
      description: 'Monitor platform activity and statistics',
      icon: <DashboardIcon sx={{ fontSize: 64 }} />,
      color: '#2e7d32',
      path: '#',
      action: 'View Analytics',
      count: '2.5K Active',
    },
    {
      title: 'Approvals',
      description: 'Review and approve alumni registrations',
      icon: <VerifiedUserIcon sx={{ fontSize: 64 }} />,
      color: '#f57c00',
      path: '#',
      action: 'Pending Reviews',
      count: '18 Pending',
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
                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Manage the Alumni Hub platform and review user accounts
            </Typography>
          </Box>
        </motion.div>

        {/* Alert Banner */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Card
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(198, 40, 40, 0.05) 100%)',
              border: '1px solid rgba(211, 47, 47, 0.2)',
              borderLeft: '4px solid #d32f2f',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    📋 Pending Approvals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You have 24 new alumni accounts waiting for approval
                  </Typography>
                </Box>
                <Button variant="contained" color="error">
                  Review Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
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
                    sx={{
                      height: '100%',
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            background: alpha(feature.color, 0.1),
                            borderRadius: '16px',
                            color: feature.color,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box
                          sx={{
                            background: alpha(feature.color, 0.1),
                            color: feature.color,
                            px: 2,
                            py: 1,
                            borderRadius: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                            {feature.count}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                        {feature.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>

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

        {/* System Stats */}
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
                  background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                  borderRadius: '2px',
                  mt: 1,
                },
              }}
            >
              System Statistics
            </Typography>

            <Grid container spacing={3}>
              {[
                { label: 'Total Users', value: '2,450', color: '#1976d2' },
                { label: 'Active Alumni', value: '540', color: '#2e7d32' },
                { label: 'Jobs Posted', value: '328', color: '#f57c00' },
                { label: 'Pending Approvals', value: '24', color: '#d32f2f' },
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

export default AdminDashboard;
