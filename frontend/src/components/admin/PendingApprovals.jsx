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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PendingApprovals = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pending = useMemo(() => {
    const filtered = users.filter((u) => u.role === 'alumni' && !u.isApproved);
    const q = query.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [users, query]);

  useEffect(() => { setPage(0); }, [query]);

  const approveAlumni = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    const ok = window.confirm('Reject and delete this user?');
    if (!ok) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/admin')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 2 }}>
            Pending Approvals
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderTop: '4px solid #f59e0b', background: `linear-gradient(135deg, ${alpha('#f59e0b', 0.03)} 0%, ${alpha('#f59e0b', 0.01)} 100%)` }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField label="Search by name/email" value={query} onChange={(e) => setQuery(e.target.value)} size="small" sx={{ minWidth: 280 }} />
        </Box>

        <TableContainer sx={{ borderRadius: 2, border: `1px solid ${alpha('#000', 0.08)}` }}>
          <Table stickyHeader sx={{
            '& thead th': {
              backgroundColor: alpha('#f59e0b', 0.08),
              borderBottom: `2px solid ${alpha('#000', 0.12)}`,
              fontWeight: 700
            },
            '& tbody td': {
              borderBottom: `1px solid ${alpha('#000', 0.06)}`,
            },
            '& tbody tr:hover': {
              backgroundColor: alpha('#f59e0b', 0.06)
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && pending
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={'Pending'} color={'warning'} size={'small'} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="contained" onClick={() => approveAlumni(u._id)}>
                        Approve
                      </Button>
                      <Tooltip title="Reject/Delete">
                        <IconButton color="error" onClick={() => deleteUser(u._id)} sx={{ ml: 1 }}>
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
          count={pending.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>
    </Container>
  );
};

export default PendingApprovals;