import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  alpha,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DescriptionIcon from '@mui/icons-material/Description';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function ResumeResources() {
  const navigate = useNavigate();
  
  const templates = [
    {
      title: 'Fresher Resume (Simple)',
      description: 'Clean, single-column layout ideal for first-time job seekers.',
      link: 'https://docs.google.com/document/u/0/?ftv=1&tgif=d',
    },
    {
      title: 'Technical Resume (CS / IT)',
      description: 'Highlights projects, skills, and impact bullets for CS/IT roles.',
      link: 'https://docs.google.com/document/u/0/?ftv=1&tgif=d',
    },
    {
      title: 'Internship Resume',
      description: 'Focused on internships with space for coursework and projects.',
      link: 'https://docs.google.com/document/u/0/?ftv=1&tgif=d',
    },
    {
      title: 'One-Page Resume (ATS Friendly)',
      description: 'One-page, ATS-safe structure with clear sections and no fluff.',
      link: 'https://docs.google.com/document/u/0/?ftv=1&tgif=d',
    },
  ];

  const dos = [
    'Use one page',
    'Use action verbs (Built, Designed, Implemented)',
    'Quantify results (improved accuracy by 20%)',
  ];

  const donts = [
    'Do not use tables or images (ATS issue)',
    'Do not add personal details (DOB, religion)',
    'Do not use fancy fonts',
  ];

  return (
    <Box
      sx={{
        py: 6,
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px), ' +
          'linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px), ' +
          'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
        backgroundSize: '22px 22px, 22px 22px, auto',
        backgroundPosition: '0 0, 0 0, 0 0',
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
        
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
            Resume Templates (Google Docs)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Students can directly copy and edit these templates in Google Docs.
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="ATS Friendly" color="success" variant="outlined" size="small" />
            <Chip label="One Page" color="success" variant="outlined" size="small" />
            <Chip label="Copy & Edit" color="success" variant="outlined" size="small" />
          </Stack>
        </Stack>

        <Grid container spacing={8} sx={{ mb: 6 }}>
          {templates.map((tpl) => (
            <Grid item xs={12} md={6} key={tpl.title}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  minHeight: 300,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid rgba(2,6,23,0.06)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DescriptionIcon sx={{ color: '#10B981' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {tpl.title}
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary">{tpl.description}</Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="contained"
                    endIcon={<LaunchIcon />}
                    href={tpl.link}
                    target="_blank"
                    rel="noopener"
                    sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                  >
                    Open Template
                  </Button>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(2,6,23,0.06)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            background: '#ffffff',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem />}> 
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#10B981' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Resume Do’s</Typography>
              </Stack>
              <List dense>
                {dos.map((item) => (
                  <ListItem key={item} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: '#10B981' }} />
                    </ListItemIcon>
                    <Typography variant="body2">{item}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <HighlightOffIcon sx={{ color: '#ef4444' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Resume Don’ts</Typography>
              </Stack>
              <List dense>
                {donts.map((item) => (
                  <ListItem key={item} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <HighlightOffIcon fontSize="small" sx={{ color: '#ef4444' }} />
                    </ListItemIcon>
                    <Typography variant="body2">{item}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
