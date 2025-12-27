import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Avatar,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axios';
import Chat from '../common/Chat';

const AlumniCard = styled(Card)(({ theme }) => ({
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

const AlumniList = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await api.get('/alumni/all');
        setAlumni(res.data);
        
        // Fetch connection statuses for all alumni
        const statuses = {};
        for (const alum of res.data) {
          try {
            const statusRes = await api.get(`/connections/status/${alum.user?._id || alum._id}`);
            statuses[alum._id] = statusRes.data;
          } catch (err) {
            statuses[alum._id] = { status: 'none' };
          }
        }
        setConnectionStatuses(statuses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((a) =>
    `${a.fullName} ${a.currentCompany} ${a.technicalSkills?.join(' ')} ${a.collegeName} ${a.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleViewProfile = (alum) => {
    setSelectedAlumni(alum);
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
    setSelectedAlumni(null);
  };

  const handleStartChat = (alum) => {
    setChatRecipient(alum);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatRecipient(null);
  };

  const handleConnect = async (alum) => {
    try {
      await api.post('/connections/request', {
        recipientId: alum.user?._id || alum._id
      });
      
      // Update connection status
      setConnectionStatuses(prev => ({
        ...prev,
        [alum._id]: { status: 'pending', isRequester: true }
      }));
      
      setMessage('Connection request sent successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send connection request');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getConnectionButton = (alum) => {
    const status = connectionStatuses[alum._id];
    
    if (!status || status.status === 'none') {
      return (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<PersonAddIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleConnect(alum);
          }}
          sx={{
            borderColor: '#10B981',
            color: '#047857',
            '&:hover': {
              borderColor: '#059669',
              bgcolor: alpha('#10B981', 0.05),
            },
          }}
        >
          Connect
        </Button>
      );
    }
    
    if (status.status === 'pending') {
      return (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          disabled
          startIcon={<HourglassEmptyIcon />}
          sx={{
            borderColor: '#fbbf24',
            color: '#d97706',
          }}
        >
          Pending
        </Button>
      );
    }
    
    if (status.status === 'accepted') {
      return (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          disabled
          startIcon={<CheckCircleIcon />}
          sx={{
            borderColor: '#10B981',
            color: '#047857',
          }}
        >
          Connected
        </Button>
      );
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
            Alumni Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect with alumni from your college
          </Typography>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search by name, company or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: '#ffffff',
            },
          }}
        />

        {filteredAlumni.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            No alumni found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredAlumni.map((alum, index) => (
              <Grid item xs={12} sm={6} md={4} key={alum._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AlumniCard>
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Header */}
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar
                            src={alum.profilePhoto}
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: alpha('#10B981', 0.15),
                              color: '#047857',
                              fontSize: '1.5rem',
                              fontWeight: 700,
                            }}
                          >
                            {alum.fullName?.charAt(0) || 'A'}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {alum.fullName || alum.user?.name}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {alum.currentCompany || 'Not specified'}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>

                        <Divider />

                        {/* Info */}
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WorkIcon sx={{ fontSize: 16, color: '#10B981' }} />
                            <Typography variant="body2" color="text.secondary">
                              {alum.designation || 'Alumni'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <SchoolIcon sx={{ fontSize: 16, color: '#10B981' }} />
                            <Typography variant="body2" color="text.secondary">
                              {alum.department} • Batch {alum.batchYear || alum.graduationYear}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Skills */}
                        {alum.technicalSkills?.length > 0 && (
                          <Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {alum.technicalSkills.slice(0, 3).map((skill, i) => (
                                <Chip
                                  key={i}
                                  label={skill}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha('#10B981', 0.1),
                                    color: '#047857',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              ))}
                              {alum.technicalSkills.length > 3 && (
                                <Chip
                                  label={`+${alum.technicalSkills.length - 3}`}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha('#10B981', 0.15),
                                    color: '#047857',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        )}

                        {/* Actions */}
                        <Stack spacing={1}>
                          {getConnectionButton(alum)}
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<ChatIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartChat(alum);
                            }}
                            sx={{
                              bgcolor: '#10B981',
                              '&:hover': { bgcolor: '#059669' },
                            }}
                          >
                            Message
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(alum);
                            }}
                            sx={{
                              color: '#047857',
                              '&:hover': {
                                bgcolor: alpha('#10B981', 0.05),
                              },
                            }}
                          >
                            View Full Profile
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </AlumniCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

      {/* Profile Dialog */}
      <Dialog
        open={openProfile}
        onClose={handleCloseProfile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        {selectedAlumni && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={selectedAlumni.profilePhoto}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: alpha('#10B981', 0.15),
                      color: '#047857',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {selectedAlumni.fullName?.charAt(0) || 'A'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {selectedAlumni.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAlumni.designation} at {selectedAlumni.currentCompany}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton onClick={handleCloseProfile}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={3}>
                {/* About */}
                {selectedAlumni.bio && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      About
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAlumni.bio}
                    </Typography>
                  </Box>
                )}

                {/* Education */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Education
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAlumni.degree} in {selectedAlumni.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAlumni.collegeName} • Batch {selectedAlumni.batchYear}
                  </Typography>
                </Box>

                {/* Professional */}
                {(selectedAlumni.currentCompany || selectedAlumni.designation) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Professional
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAlumni.designation} at {selectedAlumni.currentCompany}
                    </Typography>
                    {selectedAlumni.totalExperience && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedAlumni.totalExperience} of experience
                      </Typography>
                    )}
                    {selectedAlumni.industry && (
                      <Typography variant="body2" color="text.secondary">
                        Industry: {selectedAlumni.industry}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Technical Skills */}
                {selectedAlumni.technicalSkills?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Technical Skills
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedAlumni.technicalSkills.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: alpha('#10B981', 0.1),
                            color: '#047857',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Areas of Expertise */}
                {selectedAlumni.areasOfExpertise?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Areas of Expertise
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedAlumni.areasOfExpertise.map((area, i) => (
                        <Chip
                          key={i}
                          label={area}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: alpha('#10B981', 0.3),
                            color: '#047857',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Social Links */}
                {(selectedAlumni.linkedinLink || selectedAlumni.githubLink || selectedAlumni.portfolioLink) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Connect
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {selectedAlumni.linkedinLink && (
                        <IconButton
                          component="a"
                          href={selectedAlumni.linkedinLink}
                          target="_blank"
                          sx={{ color: '#0077b5' }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      )}
                      {selectedAlumni.githubLink && (
                        <IconButton
                          component="a"
                          href={selectedAlumni.githubLink}
                          target="_blank"
                          sx={{ color: '#333' }}
                        >
                          <GitHubIcon />
                        </IconButton>
                      )}
                      {selectedAlumni.portfolioLink && (
                        <IconButton
                          component="a"
                          href={selectedAlumni.portfolioLink}
                          target="_blank"
                          sx={{ color: '#10B981' }}
                        >
                          <LanguageIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseProfile} variant="outlined">
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={() => {
                  handleCloseProfile();
                  handleStartChat(selectedAlumni);
                }}
                sx={{
                  bgcolor: '#10B981',
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                Start Conversation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Chat Dialog */}
      <Chat
        open={openChat}
        onClose={handleCloseChat}
        recipient={chatRecipient}
      />
    </Container>
  </Box>
);
};

export default AlumniList;
