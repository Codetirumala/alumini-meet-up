import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Button, Stack, Chip, LinearProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    alumni: { verified: 0, pending: 0, rejected: 0 },
    approvals: { pending: 0, rejected: 0, approved: 0 },
    jobs: 0,
    events: 0,
    uptime: '99.9%',
    analytics: { engagement: 0, trend: 'stable' },
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    try {
      // Fetch users, jobs, and events in parallel
      const [usersRes, jobsRes, eventsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/jobs').catch(() => ({ data: [] })),
        api.get('/events').catch(() => ({ data: [] }))
      ]);
      
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
      const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];

      const alumniApproved = users.filter((u) => u.role === 'alumni' && u.isApproved).length;
      const alumniPending = users.filter((u) => u.role === 'alumni' && !u.isApproved).length;
      const activeUsers = users.filter((u) => u.role !== 'alumni' || u.isApproved).length;

      setStats({
        users: { total: users.length, active: activeUsers },
        alumni: { verified: alumniApproved, pending: alumniPending, rejected: 0 },
        approvals: { pending: alumniPending, rejected: 0, approved: alumniApproved },
        jobs: jobs.length,
        events: events.length,
        uptime: '99.9%',
        analytics: { engagement: activeUsers, trend: 'stable' },
      });
      setLastUpdated(Date.now());
    } catch (err) {
      // Fallback demo data if API not available
      setStats({
        users: { total: 0, active: 0 },
        alumni: { verified: 0, pending: 0, rejected: 0 },
        approvals: { pending: 0, rejected: 0, approved: 0 },
        jobs: 0,
        events: 0,
        uptime: '99.9%',
        analytics: { engagement: 0, trend: 'stable' },
      });
      setLastUpdated(Date.now());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s polling for near real-time
    return () => clearInterval(interval);
  }, []);

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
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Chip label="Live" color="success" size="small" sx={{ fontWeight: 700 }} />
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary">
                  Updated {new Date(lastUpdated).toLocaleTimeString()}
                </Typography>
              )}
            </Stack>
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
                    You have {stats.approvals.pending} alumni accounts waiting for approval
                  </Typography>
                </Box>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/users')}>
                  Review Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Grid container spacing={3}>
            {[{
              title: 'Total Users',
              value: stats.users.total,
              sub: `${stats.users.active} active users`,
              color: '#2563eb',
              icon: <GroupIcon sx={{ fontSize: 32 }} />,
              path: '/admin/users',
              cta: 'Manage users',
            }, {
              title: 'Alumni Profiles',
              value: (stats.alumni && stats.alumni.verified) ? stats.alumni.verified : 0,
              sub: 'Pending ' + ((stats.alumni && stats.alumni.pending) ? stats.alumni.pending : 0) + ' • Rejected ' + ((stats.alumni && stats.alumni.rejected) ? stats.alumni.rejected : 0),
              color: '#16a34a',
              icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
              path: '/admin/alumni',
              cta: 'Review alumni',
            }, {
              title: 'Pending Approvals',
              value: (stats.approvals && stats.approvals.pending) ? stats.approvals.pending : 0,
              sub: ((stats.approvals && stats.approvals.rejected) ? stats.approvals.rejected : 0) + ' rejected, ' + ((stats.approvals && stats.approvals.approved) ? stats.approvals.approved : 0) + ' approved',
              color: '#f59e0b',
              icon: <PendingIcon sx={{ fontSize: 32 }} />,
              path: '/admin/approvals',
              cta: 'Process requests',
            }, {
              title: 'Analytics Pulse',
              value: (stats.users && stats.users.active) ? stats.users.active : 0,
              sub: 'stable • updates live',
              color: '#7c3aed',
              icon: <AnalyticsIcon sx={{ fontSize: 32 }} />,
              path: '/admin/analytics',
              cta: 'View reports',
            }].map((card) => (
              <Grid item xs={12} md={3} key={card.title}>
                <motion.div variants={itemVariants} whileHover={{ translateY: -8 }} transition={{ duration: 0.3 }}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      borderTop: `6px solid ${card.color}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: -50,
                        width: 100,
                        height: 100,
                        background: alpha(card.color, 0.08),
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                      },
                      '&:hover': {
                        boxShadow: `0 16px 40px ${alpha(card.color, 0.2)}`,
                        transform: 'translateY(-8px)',
                        '&::before': {
                          right: -20,
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64,
                            background: alpha(card.color, 0.12),
                            borderRadius: '14px',
                            color: card.color,
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Chip
                          label="Live"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 700, backgroundColor: alpha('#16a34a', 0.12), color: '#166534' }}
                        />
                      </Box>

                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: card.color }}>
                        {
                          typeof card.value === 'number'
                            ? card.value.toLocaleString()
                            : typeof card.value === 'string'
                              ? card.value
                              : String(card.value ?? 0)
                        }
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 0.5 }}>
                        {card.sub}
                      </Typography>

                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(card.path)}
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            background: card.color,
                            color: 'white',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: '10px',
                            '&:hover': {
                              background: card.color,
                              boxShadow: `0 8px 16px ${alpha(card.color, 0.25)}`,
                            },
                          }}
                        >
                          {card.cta}
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
                { label: 'Total Users', value: stats.users.total.toLocaleString(), color: '#1976d2' },
                { label: 'Active Alumni', value: stats.alumni.verified.toLocaleString(), color: '#2e7d32' },
                { label: 'Jobs Posted', value: stats.jobs.toLocaleString(), color: '#f57c00' },
                { label: 'Pending Approvals', value: stats.alumni.pending.toLocaleString(), color: '#d32f2f' },
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
