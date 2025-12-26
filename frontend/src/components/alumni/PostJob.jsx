import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Stack,
  Avatar,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axios';

const FormCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: '#ffffff',
  border: '1px solid rgba(2,6,23,0.06)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
}));

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    skills: '',
    applyLink: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await api.post('/jobs', {
        ...form,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      });

      setSuccess('Job posted successfully');
      setTimeout(() => setSuccess(''), 3000);
      setForm({
        title: '',
        company: '',
        description: '',
        location: '',
        skills: '',
        applyLink: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <Box
      sx={{
        py: 6,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Container maxWidth="md">
        {/* Back Button */}
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857', width: 48, height: 48 }}>
              <WorkIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                Post a Job Opportunity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share career opportunities with students
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <FormCard sx={{ p: 4 }}>
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills Required (comma separated)"
                name="skills"
                value={form.skills}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Apply Link (Optional)"
                name="applyLink"
                value={form.applyLink}
                onChange={handleChange}
                placeholder="https://company.com/careers/job-id"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{
                  bgcolor: '#10B981',
                  '&:hover': { bgcolor: '#059669' },
                  py: 1.5,
                  px: 4,
                }}
              >
                Post Job
              </Button>
            </Grid>
          </Grid>
        </FormCard>
      </Container>
    </Box>
  );
};

export default PostJob;
