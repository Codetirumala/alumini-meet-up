import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Button,
  Paper,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveAlumni = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    const ok = window.confirm('Delete this user? This cannot be undone.');
    if (!ok) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = query.trim().toLowerCase();
      const statusText = u.isApproved ? 'approved' : 'pending';
      const matchesQuery =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        statusText.includes(q);
      const matchesRole = !role || u.role === role;
      const matchesStatus = !status || statusText === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, role, status]);

  // reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [query, role, status]);

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/admin')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 2 }}>
            Manage Users
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderTop: '4px solid #2563eb', background: `linear-gradient(135deg, ${alpha('#2563eb', 0.03)} 0%, ${alpha('#2563eb', 0.01)} 100%)` }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField label="Search by name/email/role/status" value={query} onChange={(e) => setQuery(e.target.value)} size="small" sx={{ minWidth: 280 }} />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Role</InputLabel>
            <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="alumni">Alumni</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer sx={{ borderRadius: 2, border: `1px solid ${alpha('#000', 0.08)}` }}>
        <Table stickyHeader sx={{
          '& thead th': {
            backgroundColor: alpha('#2563eb', 0.06),
            borderBottom: `2px solid ${alpha('#000', 0.12)}`,
            fontWeight: 700
          },
          '& tbody td': {
            borderBottom: `1px solid ${alpha('#000', 0.06)}`,
          },
          '& tbody tr:hover': {
            backgroundColor: alpha('#2563eb', 0.04)
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading &&
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" sx={{ textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.isApproved ? 'Approved' : 'Pending'} color={user.isApproved ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {user.role === 'alumni' && !user.isApproved && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => approveAlumni(user._id)}
                      >
                        Approve
                      </Button>
                    )}
                    <Tooltip title="Delete user">
                      <IconButton color="error" onClick={() => deleteUser(user._id)} sx={{ ml: 1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[10, 25, 50]}
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>
    </Container>
  );
};

export default ManageUsers;
