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
  Chip,
  Stack,
  Avatar,
  alpha,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import LaunchIcon from '@mui/icons-material/Launch';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    const res = await api.get('/jobs');
    setJobs(res.data);
  };

  const applyJob = async (id) => {
    try {
      await api.post(`/jobs/apply/${id}`);
      setMessage('Applied successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Box
      sx={{
        py: 6,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/student')}
          sx={{
            mb: 3,
            color: '#065f46',
            '&:hover': {
              bgcolor: alpha('#10B981', 0.08),
            },
          }}
        >
          Back to Dashboard
        </Button>
        
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
            Job Opportunities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore career opportunities shared by our alumni network
          </Typography>
        </Stack>

        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {jobs.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            No job opportunities available at the moment.
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
                        {/* Job Header */}
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar sx={{ bgcolor: alpha('#10B981', 0.15), color: '#047857' }}>
                            <WorkIcon />
                          </Avatar>
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

                        {/* Posted By */}
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <SchoolIcon sx={{ fontSize: 16, color: '#10B981' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#047857' }}>
                              Posted By
                            </Typography>
                          </Stack>
                          <Stack spacing={0.5} sx={{ pl: 3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {job.postedBy?.name || 'Alumni'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {job.postedBy?.company || 'Company not specified'} • Batch {job.postedBy?.batch || 'N/A'}
                            </Typography>
                          </Stack>
                        </Box>

                        {/* Apply Button */}
                        {job.applyLink ? (
                          <Button
                            variant="contained"
                            fullWidth
                            href={job.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<LaunchIcon />}
                            sx={{
                              bgcolor: '#10B981',
                              '&:hover': { bgcolor: '#059669' },
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Apply Now
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => applyJob(job._id)}
                            sx={{
                              bgcolor: '#10B981',
                              '&:hover': { bgcolor: '#059669' },
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Apply
                          </Button>
                        )}
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

export default Jobs;
