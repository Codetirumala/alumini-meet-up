import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import Chat from '../common/Chat';

const StudentCard = styled(Card)(({ theme }) => ({
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

const MyConnections = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      // Fetch pending requests
      const pendingRes = await api.get('/connections/pending');
      setPendingRequests(pendingRes.data);

      // Fetch accepted connections
      const acceptedRes = await api.get('/connections/my-connections');
      setAcceptedConnections(acceptedRes.data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to load connections');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    try {
      await api.put(`/connections/accept/${connectionId}`);
      setMessage('Connection request accepted!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
      fetchConnections();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to accept connection');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRejectConnection = async (connectionId) => {
    try {
      await api.delete(`/connections/${connectionId}`);
      setMessage('Connection request rejected');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
      fetchConnections();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reject connection');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
    setSelectedStudent(null);
  };

  const handleStartChat = (student) => {
    setChatRecipient(student.user || student);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatRecipient(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }} onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
            My Connections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage student connection requests and messages
          </Typography>
        </Stack>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, bgcolor: 'white', borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#10B981',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#10B981',
              },
            }}
          >
            <Tab label={`Connection Requests (${pendingRequests.length})`} />
            <Tab label={`Connected Students (${acceptedConnections.length})`} />
          </Tabs>
        </Box>

        {/* Pending Requests Tab */}
        {tabValue === 0 && (
          <>
            {pendingRequests.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                No pending connection requests
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {pendingRequests.map((request, index) => (
                  <Grid item xs={12} sm={6} md={4} key={request._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <StudentCard>
                        <CardContent>
                          <Stack spacing={2}>
                            {/* Header */}
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Avatar
                                src={request.requester?.profilePhoto}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  bgcolor: alpha('#10B981', 0.15),
                                  color: '#047857',
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                }}
                              >
                                {request.requester?.name?.charAt(0) || 'S'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {request.requester?.name}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    Student
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>

                            <Divider />

                            {/* Info */}
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <SchoolIcon sx={{ fontSize: 16, color: '#10B981' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {request.requester?.studentProfile?.department || 'Department not specified'}
                                </Typography>
                              </Stack>
                            </Stack>

                            {/* Actions */}
                            <Stack spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleAcceptConnection(request._id)}
                                sx={{
                                  bgcolor: '#10B981',
                                  '&:hover': { bgcolor: '#059669' },
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                startIcon={<ClearIcon />}
                                onClick={() => handleRejectConnection(request._id)}
                                sx={{
                                  borderColor: '#ef4444',
                                  color: '#dc2626',
                                  '&:hover': {
                                    borderColor: '#dc2626',
                                    bgcolor: alpha('#ef4444', 0.05),
                                  },
                                }}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="text"
                                size="small"
                                fullWidth
                                onClick={() => handleViewProfile(request.requester)}
                                sx={{
                                  color: '#047857',
                                  '&:hover': {
                                    bgcolor: alpha('#10B981', 0.05),
                                  },
                                }}
                              >
                                View Profile
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </StudentCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Connected Students Tab */}
        {tabValue === 1 && (
          <>
            {acceptedConnections.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                No connected students yet
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {acceptedConnections.map((connection, index) => (
                  <Grid item xs={12} sm={6} md={4} key={connection._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <StudentCard>
                        <CardContent>
                          <Stack spacing={2}>
                            {/* Header */}
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Avatar
                                src={connection.user?.profilePhoto}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  bgcolor: alpha('#10B981', 0.15),
                                  color: '#047857',
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                }}
                              >
                                {connection.user?.name?.charAt(0) || 'S'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {connection.user?.name}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    Student
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>

                            <Divider />

                            {/* Info */}
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <SchoolIcon sx={{ fontSize: 16, color: '#10B981' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {connection.user?.studentProfile?.department || 'Department not specified'}
                                </Typography>
                              </Stack>
                            </Stack>

                            {/* Actions */}
                            <Stack spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                startIcon={<ChatIcon />}
                                onClick={() => handleStartChat(connection)}
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
                                onClick={() => handleViewProfile(connection.user)}
                                sx={{
                                  color: '#047857',
                                  '&:hover': {
                                    bgcolor: alpha('#10B981', 0.05),
                                  },
                                }}
                              >
                                View Profile
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </StudentCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Student Profile Dialog */}
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
          {selectedStudent && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={selectedStudent.studentProfile?.profilePhoto || selectedStudent.profilePhoto}
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: alpha('#10B981', 0.15),
                        color: '#047857',
                        fontSize: '1.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {selectedStudent.name?.charAt(0) || 'S'}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {selectedStudent.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Student
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
                  {selectedStudent.studentProfile?.bio && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        About
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedStudent.studentProfile.bio}
                      </Typography>
                    </Box>
                  )}

                  {/* Education */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Education
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedStudent.studentProfile?.department || 'Department not specified'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedStudent.studentProfile?.collegeName || 'College not specified'}
                    </Typography>
                  </Box>

                  {/* Skills */}
                  {selectedStudent.studentProfile?.technicalSkills?.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Technical Skills
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {selectedStudent.studentProfile.technicalSkills.map((skill, i) => (
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

                  {/* Social Links */}
                  {(selectedStudent.studentProfile?.linkedinLink ||
                    selectedStudent.studentProfile?.githubLink ||
                    selectedStudent.studentProfile?.portfolioLink) && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Connect
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        {selectedStudent.studentProfile?.linkedinLink && (
                          <IconButton
                            component="a"
                            href={selectedStudent.studentProfile.linkedinLink}
                            target="_blank"
                            sx={{ color: '#0077b5' }}
                          >
                            <LinkedInIcon />
                          </IconButton>
                        )}
                        {selectedStudent.studentProfile?.githubLink && (
                          <IconButton
                            component="a"
                            href={selectedStudent.studentProfile.githubLink}
                            target="_blank"
                            sx={{ color: '#333' }}
                          >
                            <GitHubIcon />
                          </IconButton>
                        )}
                        {selectedStudent.studentProfile?.portfolioLink && (
                          <IconButton
                            component="a"
                            href={selectedStudent.studentProfile.portfolioLink}
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
                    handleStartChat({ user: selectedStudent });
                  }}
                  sx={{
                    bgcolor: '#10B981',
                    '&:hover': { bgcolor: '#059669' },
                  }}
                >
                  Send Message
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

export default MyConnections;
