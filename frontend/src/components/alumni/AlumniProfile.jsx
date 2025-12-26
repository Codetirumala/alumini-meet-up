import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Stack,
  Link as MuiLink,
  alpha,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axios';
import { motion } from 'framer-motion';

const FileInput = styled('input')({ display: 'none' });

const ProfileSection = styled(Card)(({ theme }) => ({
  marginTop: 0,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  overflow: 'visible',
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: '#ffffff',
  border: '1px solid rgba(2,6,23,0.06)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
}));

const COLLEGE_OPTIONS = [
  // Visakhapatnam (Vizag)
  { label: 'Andhra University College of Engineering (AUCE)', group: 'Visakhapatnam (Vizag)' },
  { label: 'GITAM (Gandhi Institute of Technology and Management)', group: 'Visakhapatnam (Vizag)' },
  { label: 'MVGR College of Engineering', group: 'Visakhapatnam (Vizag)' },
  { label: 'Raghu Engineering College', group: 'Visakhapatnam (Vizag)' },
  { label: 'GVP College of Engineering for Women (GVPCE)', group: 'Visakhapatnam (Vizag)' },
  { label: 'Gayatri Vidya Parishad College of Engineering', group: 'Visakhapatnam (Vizag)' },
  { label: 'Sanketika Institute of Technology and Management (SITAM)', group: 'Visakhapatnam (Vizag)' },
  { label: "Vignan's Foundation for Science, Technology and Research (VFSTR)", group: 'Visakhapatnam (Vizag)' },

  // Vizianagaram (VZM)
  { label: 'JNTUK University College of Engineering, Vizianagaram', group: 'Vizianagaram (VZM)' },
  { label: 'Maharaj Vijayaram Gajapathi Raj College Of Engineering (MVGR)', group: 'Vizianagaram (VZM)' },
  { label: 'Aditya Institute of Technology and Management (AITAM)', group: 'Vizianagaram (VZM)' },
  { label: 'Chaitanya Engineering College', group: 'Vizianagaram (VZM)' },

  // Srikakulam district
  { label: 'GMR Institute of Technology (GMRIT)', group: 'Srikakulam' },
  { label: 'Sri Sivani College of Engineering', group: 'Srikakulam' },
  { label: 'Sri Venkateswara College of Engineering & Technology (SVCET), Etcherla', group: 'Srikakulam' },
  { label: 'Sarada Institute of Science Technology & Management (SISTAM)', group: 'Srikakulam' },

  // Guntur
  { label: 'KL University (KLU)', group: 'Guntur' },
  { label: "Vignan's Foundation for Science, Technology and Research (VFSTR)", group: 'Guntur' },
  { label: 'Acharya Nagarjuna University (ANU) College of Engineering', group: 'Guntur' },
  { label: 'RVR & JC College of Engineering', group: 'Guntur' },
];

export default function AlumniProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    profilePhoto: '',
    batchYear: '',
    degree: '',
    department: '',
    collegeName: '',
    currentCompany: '',
    designation: '',
    industry: '',
    totalExperience: '',
    currentLocation: '',
    technicalSkills: [],
    tools: [],
    areasOfExpertise: [],
    openToMentorship: false,
    mentorshipAreas: [],
    preferredMode: [],
    availability: '',
    linkedinLink: '',
    githubLink: '',
    portfolioLink: '',
    resumeLink: '',
    bio: '',
    careerJourney: '',
    adviceToJuniors: '',
    interests: [],
    willingPostJobs: false,
    willingHostEvents: false,
    willingCampusTalks: false,
    profileVisibility: 'students-only',
    showEmail: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/alumni/profile');
      if (data) {
        setProfile({
          fullName: data.fullName || '',
          profilePhoto: data.profilePhoto || '',
          batchYear: data.batchYear || '',
          degree: data.degree || '',
          department: data.department || '',
          collegeName: data.collegeName || '',
          currentCompany: data.currentCompany || '',
          designation: data.designation || '',
          industry: data.industry || '',
          totalExperience: data.totalExperience || '',
          currentLocation: data.currentLocation || '',
          technicalSkills: Array.isArray(data.technicalSkills) ? data.technicalSkills : [],
          tools: Array.isArray(data.tools) ? data.tools : [],
          areasOfExpertise: Array.isArray(data.areasOfExpertise) ? data.areasOfExpertise : [],
          openToMentorship: data.openToMentorship || false,
          mentorshipAreas: Array.isArray(data.mentorshipAreas) ? data.mentorshipAreas : [],
          preferredMode: Array.isArray(data.preferredMode) ? data.preferredMode : [],
          availability: data.availability || '',
          linkedinLink: data.linkedinLink || '',
          githubLink: data.githubLink || '',
          portfolioLink: data.portfolioLink || '',
          resumeLink: data.resumeLink || '',
          bio: data.bio || '',
          careerJourney: data.careerJourney || '',
          adviceToJuniors: data.adviceToJuniors || '',
          interests: Array.isArray(data.interests) ? data.interests : [],
          willingPostJobs: data.willingPostJobs || false,
          willingHostEvents: data.willingHostEvents || false,
          willingCampusTalks: data.willingCampusTalks || false,
          profileVisibility: data.profileVisibility || 'students-only',
          showEmail: data.showEmail || false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/alumni/profile/upload?type=image', form);
      setProfile((p) => ({ ...p, profilePhoto: data.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (file) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/alumni/profile/upload?type=resume', form);
      setProfile((p) => ({ ...p, resumeLink: data.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const addItem = (field, value) => {
    const val = value.trim();
    if (!val) return;
    setProfile((p) => ({ ...p, [field]: [...(p[field] || []), val] }));
  };

  const removeItem = (field, idx) => {
    setProfile((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        pt: 6,
        pb: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Container maxWidth="lg">
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
        {/* Profile Header */}
        <ProfileSection component={motion.div} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ position: 'relative' }}>
                    <Avatar src={profile.profilePhoto} sx={{ width: 96, height: 96, border: '3px solid', borderColor: alpha('#10B981', 0.5) }} />
                    <Box sx={{ position: 'absolute', bottom: -6, right: -6 }}>
                      <label htmlFor="photo-upload">
                        <FileInput id="photo-upload" type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])} />
                        <IconButton component="span" size="small" sx={{ bgcolor: alpha('#059669', 0.2), color: '#047857', '&:hover': { bgcolor: alpha('#059669', 0.3) } }} disabled={uploading}>
                          <CameraAltIcon fontSize="small" />
                        </IconButton>
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    {editMode ? (
                      <Stack spacing={1}>
                        <TextField label="Full Name" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} fullWidth />
                        <Autocomplete
                          options={COLLEGE_OPTIONS}
                          freeSolo
                          groupBy={(option) => option.group || ''}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                          value={profile.collegeName || ''}
                          onChange={(_, val) => setProfile({ ...profile, collegeName: typeof val === 'string' ? val : (val?.label || '') })}
                          onInputChange={(_, val) => setProfile({ ...profile, collegeName: val })}
                          renderInput={(params) => <TextField {...params} label="College Name" fullWidth />}
                        />
                        <TextField label="Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} fullWidth multiline minRows={2} />
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={4}>
                            <TextField label="LinkedIn URL" value={profile.linkedinLink} onChange={(e) => setProfile({ ...profile, linkedinLink: e.target.value })} fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField label="GitHub URL" value={profile.githubLink} onChange={(e) => setProfile({ ...profile, githubLink: e.target.value })} fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField label="Portfolio URL" value={profile.portfolioLink} onChange={(e) => setProfile({ ...profile, portfolioLink: e.target.value })} fullWidth />
                          </Grid>
                        </Grid>
                      </Stack>
                    ) : (
                      <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{profile.fullName || 'Alumni Name'}</Typography>
                        {profile.collegeName && (
                          <Typography variant="body2" color="text.secondary">{profile.collegeName}</Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">{profile.bio || 'Add a short professional bio.'}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                          {profile.linkedinLink && (
                            <MuiLink href={profile.linkedinLink} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 1, bgcolor: alpha('#10B981', 0.1), color: '#065f46', textDecoration: 'none', '&:hover': { bgcolor: alpha('#10B981', 0.18) } }}>
                              <LinkedInIcon fontSize="small" /> LinkedIn
                            </MuiLink>
                          )}
                          {profile.githubLink && (
                            <MuiLink href={profile.githubLink} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 1, bgcolor: alpha('#10B981', 0.1), color: '#065f46', textDecoration: 'none', '&:hover': { bgcolor: alpha('#10B981', 0.18) } }}>
                              <GitHubIcon fontSize="small" /> GitHub
                            </MuiLink>
                          )}
                          {profile.portfolioLink && (
                            <MuiLink href={profile.portfolioLink} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 1, bgcolor: alpha('#10B981', 0.1), color: '#065f46', textDecoration: 'none', '&:hover': { bgcolor: alpha('#10B981', 0.18) } }}>
                              <LanguageIcon fontSize="small" /> Portfolio
                            </MuiLink>
                          )}
                        </Stack>
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {editMode ? (
                    <>
                      <Button variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={handleSave}>Save</Button>
                      <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditMode(false)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="contained" startIcon={<EditIcon />} sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => setEditMode(true)}>Edit</Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </ProfileSection>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Left Column 8 */}
          <Grid item xs={12} md={8}>
            {/* Academic & Professional Details */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Education & Career</Typography>
                </Stack>
                {editMode ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Degree (B.Tech/M.Tech/MBA/etc)" fullWidth value={profile.degree} onChange={(e) => setProfile({ ...profile, degree: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Department" fullWidth value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Batch Year" type="number" fullWidth value={profile.batchYear} onChange={(e) => setProfile({ ...profile, batchYear: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Current Company" fullWidth value={profile.currentCompany} onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Designation / Job Title" fullWidth value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Industry / Domain" fullWidth value={profile.industry} onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Total Experience (years)" fullWidth value={profile.totalExperience} onChange={(e) => setProfile({ ...profile, totalExperience: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Current Location" fullWidth value={profile.currentLocation} onChange={(e) => setProfile({ ...profile, currentLocation: e.target.value })} />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><Typography><b>Degree:</b> {profile.degree || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Department:</b> {profile.department || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Batch:</b> {profile.batchYear || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Company:</b> {profile.currentCompany || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Designation:</b> {profile.designation || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Industry:</b> {profile.industry || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Experience:</b> {profile.totalExperience || '—'} years</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Location:</b> {profile.currentLocation || '—'}</Typography></Grid>
                  </Grid>
                )}
              </CardContent>
            </SectionCard>

            {/* Bio & Career Journey */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <WorkIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Bio & Career</Typography>
                </Stack>
                {editMode ? (
                  <Stack spacing={2}>
                    <TextField label="Professional Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} fullWidth multiline minRows={2} />
                    <TextField label="Career Journey" value={profile.careerJourney} onChange={(e) => setProfile({ ...profile, careerJourney: e.target.value })} fullWidth multiline minRows={3} />
                    <TextField label="Advice to Juniors" value={profile.adviceToJuniors} onChange={(e) => setProfile({ ...profile, adviceToJuniors: e.target.value })} fullWidth multiline minRows={3} />
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {profile.bio && <Typography color="text.secondary">{profile.bio}</Typography>}
                    {profile.careerJourney && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Career Journey</Typography>
                        <Typography color="text.secondary">{profile.careerJourney}</Typography>
                      </Box>
                    )}
                    {profile.adviceToJuniors && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Advice to Juniors</Typography>
                        <Typography color="text.secondary">{profile.adviceToJuniors}</Typography>
                      </Box>
                    )}
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Mentorship */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Mentorship & Contribution</Typography>
                </Stack>
                {editMode ? (
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Switch checked={profile.openToMentorship} onChange={(e) => setProfile({ ...profile, openToMentorship: e.target.checked })} />}
                      label="Open to Mentorship?"
                    />
                    {profile.openToMentorship && (
                      <Stack spacing={2}>
                        <TextField label="Mentorship Areas (comma-separated)" value={profile.mentorshipAreas.join(', ')} onChange={(e) => setProfile({ ...profile, mentorshipAreas: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} fullWidth />
                        <TextField label="Preferred Mode (Chat/Call/Email)" value={profile.preferredMode.join(', ')} onChange={(e) => setProfile({ ...profile, preferredMode: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} fullWidth />
                        <TextField label="Availability (e.g., Weekends, Evenings)" value={profile.availability} onChange={(e) => setProfile({ ...profile, availability: e.target.value })} fullWidth />
                      </Stack>
                    )}
                    <FormControlLabel
                      control={<Switch checked={profile.willingPostJobs} onChange={(e) => setProfile({ ...profile, willingPostJobs: e.target.checked })} />}
                      label="Willing to Post Jobs?"
                    />
                    <FormControlLabel
                      control={<Switch checked={profile.willingHostEvents} onChange={(e) => setProfile({ ...profile, willingHostEvents: e.target.checked })} />}
                      label="Willing to Host Events?"
                    />
                    <FormControlLabel
                      control={<Switch checked={profile.willingCampusTalks} onChange={(e) => setProfile({ ...profile, willingCampusTalks: e.target.checked })} />}
                      label="Interested in Campus Talks?"
                    />
                  </Stack>
                ) : (
                  <Stack spacing={1}>
                    <Typography><b>Mentorship:</b> {profile.openToMentorship ? 'Yes' : 'Not available'}</Typography>
                    {profile.openToMentorship && (
                      <>
                        <Typography><b>Areas:</b> {profile.mentorshipAreas.join(', ') || '—'}</Typography>
                        <Typography><b>Mode:</b> {profile.preferredMode.join(', ') || '—'}</Typography>
                        <Typography><b>Availability:</b> {profile.availability || '—'}</Typography>
                      </>
                    )}
                    <Typography><b>Post Jobs:</b> {profile.willingPostJobs ? 'Yes' : 'No'}</Typography>
                    <Typography><b>Host Events:</b> {profile.willingHostEvents ? 'Yes' : 'No'}</Typography>
                    <Typography><b>Campus Talks:</b> {profile.willingCampusTalks ? 'Yes' : 'No'}</Typography>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>
          </Grid>

          {/* Right Column 4 */}
          <Grid item xs={12} md={4}>
            {/* Technical Skills */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Technical Skills</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.technicalSkills || []).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      variant="outlined"
                      onDelete={editMode ? () => removeItem('technicalSkills', idx) : undefined}
                      sx={{ borderColor: alpha('#10B981', 0.35), bgcolor: alpha('#10B981', 0.08), color: '#065f46', fontWeight: 600 }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981' }} onClick={() => { addItem('technicalSkills', newSkill); setNewSkill(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Tools */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Tools & Technologies</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.tools || []).map((tool, idx) => (
                    <Chip
                      key={idx}
                      label={tool}
                      variant="outlined"
                      onDelete={editMode ? () => removeItem('tools', idx) : undefined}
                      sx={{ borderColor: alpha('#059669', 0.35), bgcolor: alpha('#059669', 0.08), color: '#065f46', fontWeight: 600 }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add tool" value={newTool} onChange={(e) => setNewTool(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981' }} onClick={() => { addItem('tools', newTool); setNewTool(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Areas of Expertise */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Areas of Expertise</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.areasOfExpertise || []).map((area, idx) => (
                    <Chip
                      key={idx}
                      label={area}
                      variant="outlined"
                      onDelete={editMode ? () => removeItem('areasOfExpertise', idx) : undefined}
                      sx={{ borderColor: alpha('#047857', 0.35), bgcolor: alpha('#047857', 0.08), color: '#065f46', fontWeight: 600 }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add expertise" value={newExpertise} onChange={(e) => setNewExpertise(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981' }} onClick={() => { addItem('areasOfExpertise', newExpertise); setNewExpertise(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Interests */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Interests</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.interests || []).map((interest, idx) => (
                    <Chip
                      key={idx}
                      label={interest}
                      variant="outlined"
                      onDelete={editMode ? () => removeItem('interests', idx) : undefined}
                      sx={{ borderColor: alpha('#065f46', 0.35), bgcolor: alpha('#065f46', 0.08), color: '#065f46', fontWeight: 600 }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add interest" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981' }} onClick={() => { addItem('interests', newInterest); setNewInterest(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Resume Upload */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mt: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <DescriptionIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Resume</Typography>
                </Stack>
                <Stack spacing={2}>
                  {profile.resumeLink && (
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#10B981', 0.08), border: '1px solid', borderColor: alpha('#10B981', 0.25) }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon sx={{ color: '#10B981' }} />
                        <MuiLink href={profile.resumeLink} target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: '#065f46', fontWeight: 600, flex: 1 }}>
                          View Resume
                        </MuiLink>
                      </Stack>
                    </Box>
                  )}
                  <label htmlFor="resume-upload">
                    <FileInput id="resume-upload" type="file" accept="application/pdf" onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])} />
                    <Button component="span" variant="contained" fullWidth sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} disabled={uploading}>
                      {profile.resumeLink ? 'Update Resume' : 'Upload Resume (PDF)'}
                    </Button>
                  </label>
                </Stack>
              </CardContent>
            </SectionCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
