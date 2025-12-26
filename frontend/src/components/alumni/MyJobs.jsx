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
  Chip,
  alpha,
  Divider,
  Badge,
  IconButton,
  Alert,
  Snackbar,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const JobCard = styled(Card)(({ theme }) => ({
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

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      setMessage('Job deleted successfully');
      setOpenSnackbar(true);
      fetchMyJobs();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete job');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

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
                My Posted Jobs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your job postings and applicants
              </Typography>
            </Box>
            <Chip
              label={`${jobs.length} Jobs Posted`}
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

        {jobs.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            You haven't posted any jobs yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job, idx) => (
              <Grid item xs={12} md={6} key={job._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <JobCard>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        {/* Header with title, company, and actions */}
                        <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {job.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {job.company}
                              </Typography>
                            </Stack>
                          </Box>
                          <IconButton
                            onClick={() => handleDelete(job._id)}
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
                          {job.description}
                        </Typography>

                        {/* Location */}
                        {job.location && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon sx={{ fontSize: 16, color: '#10B981' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                          </Stack>
                        )}

                        {/* Skills */}
                        {job.skillsRequired?.length > 0 && (
                          <Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {job.skillsRequired.slice(0, 4).map((skill, i) => (
                                <Chip
                                  key={i}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: alpha('#10B981', 0.3),
                                    color: '#047857',
                                    fontSize: '0.75rem',
                                  }}
                                />
                              ))}
                              {job.skillsRequired.length > 4 && (
                                <Chip
                                  label={`+${job.skillsRequired.length - 4} more`}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha('#10B981', 0.1),
                                    color: '#047857',
                                    fontSize: '0.75rem',
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        )}

                        <Divider />

                        {/* Applicants Info */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Badge
                            badgeContent={job.applicants?.length || 0}
                            color="success"
                            max={99}
                          >
                            <Avatar sx={{ bgcolor: alpha('#10B981', 0.1), color: '#047857', width: 36, height: 36 }}>
                              <PeopleIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                          </Badge>
                          <Typography variant="body2" color="text.secondary">
                            {job.applicants?.length || 0} {job.applicants?.length === 1 ? 'applicant' : 'applicants'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </JobCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyJobs;
