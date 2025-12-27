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
	Paper,
	Box,
	TextField,
	Chip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ApproveAlumni = () => {
	const navigate = useNavigate();
	const [profiles, setProfiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');
	const [department, setDepartment] = useState('');
	const [batch, setBatch] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const fetchProfiles = async () => {
		try {
			const res = await api.get('/alumni/all');
			setProfiles(Array.isArray(res.data) ? res.data : []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfiles();
	}, []);

	const filtered = useMemo(() => {
		return profiles.filter((p) => {
			const q = query.trim().toLowerCase();
			const matchesQuery =
				!q ||
				p.fullName?.toLowerCase().includes(q) ||
				p.user?.name?.toLowerCase().includes(q) ||
				p.user?.email?.toLowerCase().includes(q) ||
				p.currentCompany?.toLowerCase().includes(q) ||
				p.designation?.toLowerCase().includes(q);

			const matchesDept = !department || (p.department === department);
			const matchesBatch = !batch || (String(p.batchYear) === batch);
			return matchesQuery && matchesDept && matchesBatch;
		});
	}, [profiles, query, department, batch]);

	useEffect(() => {
		setPage(0);
	}, [query, department, batch]);

	return (
		<Container>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<IconButton onClick={() => navigate('/admin')} color="primary">
						<ArrowBackIcon />
					</IconButton>
					<Typography variant="h4" sx={{ fontWeight: 700, mt: 2 }}>
						Alumni Profiles
					</Typography>
				</Box>
			</Box>

			<Paper sx={{ p: 2, borderTop: '4px solid #16a34a', background: `linear-gradient(135deg, ${alpha('#16a34a', 0.03)} 0%, ${alpha('#16a34a', 0.01)} 100%)` }}>
				<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
					<TextField label="Search name/email/company" value={query} onChange={(e) => setQuery(e.target.value)} size="small" sx={{ minWidth: 280 }} />
					<FormControl size="small" sx={{ minWidth: 160 }}>
						<InputLabel>Department</InputLabel>
						<Select value={department} label="Department" onChange={(e) => setDepartment(e.target.value)}>
							<MenuItem value="">All</MenuItem>
							{[...new Set(profiles.map(p => p.department).filter(Boolean))].map((d) => (
								<MenuItem key={d} value={d}>{d}</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl size="small" sx={{ minWidth: 120 }}>
						<InputLabel>Batch</InputLabel>
						<Select value={batch} label="Batch" onChange={(e) => setBatch(e.target.value)}>
							<MenuItem value="">All</MenuItem>
							{[...new Set(profiles.map(p => p.batchYear).filter(Boolean))].map((b) => (
								<MenuItem key={b} value={String(b)}>{b}</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				<TableContainer sx={{ borderRadius: 2, border: `1px solid ${alpha('#000', 0.08)}` }}>
					<Table stickyHeader sx={{
						'& thead th': {
							backgroundColor: alpha('#16a34a', 0.06),
							borderBottom: `2px solid ${alpha('#000', 0.12)}`,
							fontWeight: 700
						},
						'& tbody td': {
							borderBottom: `1px solid ${alpha('#000', 0.06)}`,
						},
						'& tbody tr:hover': {
							backgroundColor: alpha('#16a34a', 0.04)
						}
					}}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Department</TableCell>
								<TableCell>Batch</TableCell>
								<TableCell>Company</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Mentorship</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!loading && filtered
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((p) => (
									<TableRow key={p._id}>
										<TableCell>{p.fullName || p.user?.name}</TableCell>
										<TableCell>{p.user?.email}</TableCell>
										<TableCell>{p.department || '-'}</TableCell>
										<TableCell>{p.batchYear || '-'}</TableCell>
										<TableCell>{p.currentCompany || '-'}</TableCell>
										<TableCell>{p.designation || '-'}</TableCell>
										<TableCell>
											<Chip label={p.openToMentorship ? 'Open' : 'Closed'} color={p.openToMentorship ? 'success' : 'default'} size="small" />
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					component="div"
					rowsPerPageOptions={[10, 25, 50]}
					count={filtered.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(e, newPage) => setPage(newPage)}
					onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
				/>
			</Paper>
		</Container>
	);
};

export default ApproveAlumni;
