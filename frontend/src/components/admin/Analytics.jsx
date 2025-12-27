import { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Chip, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#7c3aed'];

const Analytics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
      setLastUpdated(Date.now());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Derived KPI
  const kpis = useMemo(() => {
    const total = users.length;
    const admin = users.filter(u => u.role === 'admin').length;
    const alumniApproved = users.filter(u => u.role === 'alumni' && u.isApproved).length;
    const alumniPending = users.filter(u => u.role === 'alumni' && !u.isApproved).length;
    const students = users.filter(u => u.role === 'student').length;
    const activeUsers = users.filter(u => u.role !== 'alumni' || u.isApproved).length;
    return { total, admin, alumniApproved, alumniPending, students, activeUsers };
  }, [users]);

  // Line chart: signups per month (from createdAt)
  const signupsPerMonth = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({ m: i, label: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }), count: 0 }));
    users.forEach(u => {
      const d = new Date(u.createdAt || Date.now());
      const m = d.getMonth();
      months[m].count += 1;
    });
    return months.map(x => ({ month: x.label, Signups: x.count }));
  }, [users]);

  // Pie chart: roles distribution
  const roleDistribution = useMemo(() => {
    const roles = ['admin', 'alumni', 'student'];
    return roles.map((r) => ({ name: r[0].toUpperCase() + r.slice(1), value: users.filter(u => u.role === r).length }));
  }, [users]);

  // Bar chart: approvals status
  const approvalsData = useMemo(() => ([
    { name: 'Approved Alumni', value: kpis.alumniApproved },
    { name: 'Pending Alumni', value: kpis.alumniPending },
  ]), [kpis]);

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Analytics Overview
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Live" color="success" size="small" sx={{ fontWeight: 700 }} />
            {lastUpdated && <Typography variant="caption" color="text.secondary">Updated {new Date(lastUpdated).toLocaleTimeString()}</Typography>}
          </Stack>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 1 }}>
          {[{
            title: 'Active Users', value: kpis.activeUsers, color: '#2563eb'
          }, {
            title: 'Approved Alumni', value: kpis.alumniApproved, color: '#16a34a'
          }, {
            title: 'Pending Requests', value: kpis.alumniPending, color: '#f59e0b'
          }, {
            title: 'Total Users', value: kpis.total, color: '#7c3aed'
          }].map((k) => (
            <Grid item xs={12} md={3} key={k.title}>
              <Card sx={{ borderTop: `6px solid ${k.color}`, background: `linear-gradient(135deg, ${alpha(k.color, 0.06)} 0%, ${alpha(k.color, 0.02)} 100%)` }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: k.color }}>{k.value}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{k.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Line Chart */}
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Signups By Month</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={signupsPerMonth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="Signups" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={19}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Roles Distribution</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={roleDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Alumni Approvals</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={approvalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Recent Signups */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Recent Users</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr', gap: 1, px: 1 }}>
                <Box sx={{ fontWeight: 700, color: 'text.secondary' }}>Name</Box>
                <Box sx={{ fontWeight: 700, color: 'text.secondary' }}>Email</Box>
                <Box sx={{ fontWeight: 700, color: 'text.secondary' }}>Role</Box>
                {users
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 8)
                  .map((u) => (
                    <>
                      <Box key={u._id + '-n'} sx={{ py: 0.5, borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>{u.name}</Box>
                      <Box key={u._id + '-e'} sx={{ py: 0.5, borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>{u.email}</Box>
                      <Box key={u._id + '-r'} sx={{ py: 0.5, borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>{u.role}</Box>
                    </>
                  ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Analytics;