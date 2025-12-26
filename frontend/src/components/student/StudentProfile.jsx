import { useEffect, useState } from 'react';
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
  Divider,
  Stack,
  Link as MuiLink,
  alpha,
  Paper,
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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import api from '../../api/axios';
import { motion } from 'framer-motion';

const FileInput = styled('input')({ display: 'none' });

const BannerBox = styled(Box)(({ theme, bannerUrl }) => ({
  height: 260,
  background: bannerUrl
    ? `url(${bannerUrl}) center/cover`
    : 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
  position: 'relative',
  borderRadius: '16px 16px 0 0',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 100%)',
    pointerEvents: 'none',
  },
}));

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

export default function StudentProfile() {
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
  const [profile, setProfile] = useState({
    rollNumber: '',
    department: '',
    degree: '',
    year: '',
    graduationYear: '',
    skills: [],
    tools: [],
    interests: [],
    careerGoals: '',
    resumeLink: '',
    profilePhoto: '',
    bannerPhoto: '',
    githubLink: '',
    linkedinLink: '',
    portfolioLink: '',
    bio: '',
    displayName: '',
    collegeName: '',
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
      try {
        const { data } = await api.get('/student/profile');
        if (data) {
          setProfile({
            rollNumber: data.rollNumber || '',
            department: data.department || '',
          degree: data.degree || '',
            year: data.year || '',
            graduationYear: data.graduationYear || '',
            skills: Array.isArray(data.skills) ? data.skills : [],
          tools: Array.isArray(data.tools) ? data.tools : [],
          interests: Array.isArray(data.interests) ? data.interests : [],
          careerGoals: data.careerGoals || '',
            resumeLink: data.resumeLink || '',
            profilePhoto: data.profilePhoto || '',
          bannerPhoto: data.bannerPhoto || '',
          githubLink: data.githubLink || '',
          linkedinLink: data.linkedinLink || '',
          portfolioLink: data.portfolioLink || '',
            bio: data.bio || '',
            displayName: data.displayName || (data.user && data.user.name) || '',
            collegeName: data.collegeName || '',
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          achievements: Array.isArray(data.achievements) ? data.achievements : [],
          });
        }
      } catch (err) {
        console.error(err);
      }
  };

  const handleUpload = async (file, type) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post(`/student/profile/upload?type=${type}`, form);
      if (type === 'image') setProfile((p) => ({ ...p, profilePhoto: data.url }));
      if (type === 'banner') setProfile((p) => ({ ...p, bannerPhoto: data.url }));
      if (type === 'resume') setProfile((p) => ({ ...p, resumeLink: data.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.post('/student/profile', profile);
      await fetchProfile();
      setEditMode(false);
    } catch (err) {
      console.error(err);
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

  const addExperience = () => {
    setProfile((p) => ({
      ...p,
      experience: [...p.experience, { company: '', role: '', duration: '', description: '' }],
    }));
  };

  const updateExperience = (idx, field, value) => {
    const updated = [...profile.experience];
    updated[idx][field] = value;
    setProfile((p) => ({ ...p, experience: updated }));
  };

  const removeExperience = (idx) => {
    setProfile((p) => ({ ...p, experience: p.experience.filter((_, i) => i !== idx) }));
  };

  const addProject = () => {
    setProfile((p) => ({
      ...p,
      projects: [...p.projects, { title: '', description: '', technologies: [], link: '' }],
    }));
  };

  const updateProject = (idx, field, value) => {
    const updated = [...profile.projects];
    updated[idx][field] = value;
    setProfile((p) => ({ ...p, projects: updated }));
  };

  const removeProject = (idx) => {
    setProfile((p) => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }));
  };

  const addCertification = () => {
    setProfile((p) => ({
      ...p,
      certifications: [...p.certifications, { title: '', issuer: '', date: '', credentialLink: '' }],
    }));
  };

  const updateCertification = (idx, field, value) => {
    const updated = [...profile.certifications];
    updated[idx][field] = value;
    setProfile((p) => ({ ...p, certifications: updated }));
  };

  const removeCertification = (idx) => {
    setProfile((p) => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }));
  };

  return (
    <Box sx={{ pt: 6, pb: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)' }}>
      <Container maxWidth="lg">
        {/* Banner Section */}
        {/* Profile Header (No banner) */}
        <ProfileSection component={motion.div} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ position: 'relative' }}>
                    <Avatar src={profile.profilePhoto} sx={{ width: 96, height: 96, border: '3px solid', borderColor: alpha('#10B981', 0.5) }} />
                    <Box sx={{ position: 'absolute', bottom: -6, right: -6 }}>
                      <label htmlFor="photo-upload">
                        <FileInput id="photo-upload" type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'image')} />
                        <IconButton component="span" size="small" sx={{ bgcolor: alpha('#059669', 0.2), color: '#047857', '&:hover': { bgcolor: alpha('#059669', 0.3) } }} disabled={uploading}>
                          <CameraAltIcon fontSize="small" />
                        </IconButton>
                      </label>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    {editMode ? (
                      <Stack spacing={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <TextField label="Name" value={profile.displayName || ''} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={6}>
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
                          </Grid>
                        </Grid>
                        <TextField label="Bio" value={profile.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} fullWidth multiline minRows={2} />
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={4}>
                            <TextField label="GitHub URL" value={profile.githubLink || ''} onChange={(e) => setProfile({ ...profile, githubLink: e.target.value })} fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField label="LinkedIn URL" value={profile.linkedinLink || ''} onChange={(e) => setProfile({ ...profile, linkedinLink: e.target.value })} fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField label="Portfolio URL" value={profile.portfolioLink || ''} onChange={(e) => setProfile({ ...profile, portfolioLink: e.target.value })} fullWidth />
                          </Grid>
                        </Grid>
                      </Stack>
                    ) : (
                      <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{profile.displayName || 'Student Name'}</Typography>
                        {profile.collegeName && (
                          <Typography variant="body2" color="text.secondary">{profile.collegeName}</Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">{profile.bio || 'Add a short bio introducing yourself.'}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                          {profile.githubLink && (
                            <MuiLink href={profile.githubLink} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 1, bgcolor: alpha('#10B981', 0.1), color: '#065f46', textDecoration: 'none', '&:hover': { bgcolor: alpha('#10B981', 0.18) } }}>
                              <GitHubIcon fontSize="small" /> GitHub
                            </MuiLink>
                          )}
                          {profile.linkedinLink && (
                            <MuiLink href={profile.linkedinLink} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 1, bgcolor: alpha('#10B981', 0.1), color: '#065f46', textDecoration: 'none', '&:hover': { bgcolor: alpha('#10B981', 0.18) } }}>
                              <LinkedInIcon fontSize="small" /> LinkedIn
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
                      <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => { setEditMode(false); }}>Cancel</Button>
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
            {/* Academic Details */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Academic Details</Typography>
                </Stack>
                {editMode ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Roll Number" fullWidth value={profile.rollNumber} onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Department" fullWidth value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Degree" fullWidth value={profile.degree} onChange={(e) => setProfile({ ...profile, degree: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Current Year" type="number" fullWidth value={profile.year} onChange={(e) => setProfile({ ...profile, year: Number(e.target.value) })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Graduation Year" type="number" fullWidth value={profile.graduationYear} onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) })} />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><Typography><b>Roll:</b> {profile.rollNumber || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Department:</b> {profile.department || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Degree:</b> {profile.degree || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Year:</b> {profile.year || '—'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><b>Graduation:</b> {profile.graduationYear || '—'}</Typography></Grid>
                  </Grid>
                )}
              </CardContent>
            </SectionCard>

            {/* Experience */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <WorkIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Experience</Typography>
                  {editMode && (
                    <Button size="small" startIcon={<AddIcon />} sx={{ ml: 'auto', bgcolor: alpha('#10B981', 0.15), color: '#047857', '&:hover': { bgcolor: alpha('#10B981', 0.25) } }} onClick={addExperience}>Add</Button>
                  )}
                </Stack>
                {(profile.experience || []).length === 0 && !editMode && (
                  <Typography color="text.secondary">Add internships, part-time roles, or projects.</Typography>
                )}
                <Stack spacing={2}>
                  {(profile.experience || []).map((exp, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: alpha('#10B981', 0.25) }}>
                      {editMode ? (
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}><TextField label="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12} sm={6}><TextField label="Role" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12} sm={6}><TextField label="Duration" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12}><TextField label="Description" value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} fullWidth multiline minRows={2} /></Grid>
                          <Grid item xs={12}>
                            <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeExperience(idx)}>Delete</Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{exp.role || 'Role'}</Typography>
                          <Typography color="text.secondary">{exp.company || 'Company'} • {exp.duration || 'Duration'}</Typography>
                          {exp.description && <Typography>{exp.description}</Typography>}
                        </Stack>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Projects */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <CodeIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Projects</Typography>
                  {editMode && (
                    <Button size="small" startIcon={<AddIcon />} sx={{ ml: 'auto', bgcolor: alpha('#10B981', 0.15), color: '#047857', '&:hover': { bgcolor: alpha('#10B981', 0.25) } }} onClick={addProject}>Add</Button>
                  )}
                </Stack>
                {(profile.projects || []).length === 0 && !editMode && (
                  <Typography color="text.secondary">Showcase notable academic or personal projects.</Typography>
                )}
                <Stack spacing={2}>
                  {(profile.projects || []).map((proj, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: alpha('#10B981', 0.25) }}>
                      {editMode ? (
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}><TextField label="Title" value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12} sm={6}><TextField label="Link" value={proj.link} onChange={(e) => updateProject(idx, 'link', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12}><TextField label="Description" value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} fullWidth multiline minRows={2} /></Grid>
                          <Grid item xs={12}><TextField label="Technologies (comma-separated)" value={(proj.technologies || []).join(', ')} onChange={(e) => updateProject(idx, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} fullWidth /></Grid>
                          <Grid item xs={12}>
                            <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeProject(idx)}>Delete</Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{proj.title || 'Project Title'}</Typography>
                          {proj.link && (
                            <MuiLink href={proj.link} target="_blank" rel="noopener">View Project</MuiLink>
                          )}
                          {proj.description && <Typography>{proj.description}</Typography>}
                          {(proj.technologies || []).length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                              {proj.technologies.map((t, i) => (
                                <Chip key={i} label={t} size="small" sx={{ bgcolor: alpha('#10B981', 0.12) }} />
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Certifications */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <EmojiEventsIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Certifications</Typography>
                  {editMode && (
                    <Button size="small" startIcon={<AddIcon />} sx={{ ml: 'auto', bgcolor: alpha('#10B981', 0.15), color: '#047857', '&:hover': { bgcolor: alpha('#10B981', 0.25) } }} onClick={addCertification}>Add</Button>
                  )}
                </Stack>
                {(profile.certifications || []).length === 0 && !editMode && (
                  <Typography color="text.secondary">Add certificates or online course credentials.</Typography>
                )}
                <Stack spacing={2}>
                  {(profile.certifications || []).map((cert, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: alpha('#10B981', 0.25) }}>
                      {editMode ? (
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}><TextField label="Title" value={cert.title} onChange={(e) => updateCertification(idx, 'title', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12} sm={6}><TextField label="Issuer" value={cert.issuer} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12} sm={6}><TextField label="Date" value={cert.date} onChange={(e) => updateCertification(idx, 'date', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12}><TextField label="Credential Link" value={cert.credentialLink} onChange={(e) => updateCertification(idx, 'credentialLink', e.target.value)} fullWidth /></Grid>
                          <Grid item xs={12}>
                            <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeCertification(idx)}>Delete</Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{cert.title || 'Certificate Title'}</Typography>
                          <Typography color="text.secondary">{cert.issuer || 'Issuer'} {cert.date ? `• ${cert.date}` : ''}</Typography>
                          {cert.credentialLink && (
                            <MuiLink href={cert.credentialLink} target="_blank" rel="noopener">View Credential</MuiLink>
                          )}
                        </Stack>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </SectionCard>
          </Grid>

          {/* Right Column 4 */}
          <Grid item xs={12} md={4}>
            {/* Skills */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <CodeIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Skills</Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.skills || []).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      variant="outlined"
                      size="medium"
                      onDelete={editMode ? () => removeItem('skills', idx) : undefined}
                      sx={{
                        borderColor: alpha('#10B981', 0.35),
                        bgcolor: alpha('#10B981', 0.08),
                        color: '#065f46',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.3,
                      }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => { addItem('skills', newSkill); setNewSkill(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Tools */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <WorkIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Tools</Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.tools || []).map((tool, idx) => (
                    <Chip
                      key={idx}
                      label={tool}
                      variant="outlined"
                      size="medium"
                      onDelete={editMode ? () => removeItem('tools', idx) : undefined}
                      sx={{
                        borderColor: alpha('#059669', 0.35),
                        bgcolor: alpha('#059669', 0.08),
                        color: '#065f46',
                        fontWeight: 600,
                        letterSpacing: 0.3,
                      }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add a tool" value={newTool} onChange={(e) => setNewTool(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => { addItem('tools', newTool); setNewTool(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Interests */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <EmojiEventsIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Interests</Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(profile.interests || []).map((interest, idx) => (
                    <Chip
                      key={idx}
                      label={interest}
                      variant="outlined"
                      size="medium"
                      onDelete={editMode ? () => removeItem('interests', idx) : undefined}
                      sx={{
                        borderColor: alpha('#047857', 0.35),
                        bgcolor: alpha('#047857', 0.08),
                        color: '#065f46',
                        fontWeight: 600,
                        letterSpacing: 0.3,
                      }}
                    />
                  ))}
                </Stack>
                {editMode && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField size="small" placeholder="Add an interest" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} />
                    <Button size="small" variant="contained" sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => { addItem('interests', newInterest); setNewInterest(''); }}>Add</Button>
                  </Stack>
                )}
              </CardContent>
            </SectionCard>

            {/* Career Goals */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <WorkIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Career Goals</Typography>
                </Stack>
                {editMode ? (
                  <TextField value={profile.careerGoals || ''} onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })} fullWidth multiline minRows={3} />
                ) : (
                  <Typography color="text.secondary">{profile.careerGoals || 'Describe your aspirations and target roles or domains.'}</Typography>
                )}
              </CardContent>
            </SectionCard>

            {/* Resume Upload */}
            <SectionCard component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#10B981', 0.2), color: '#047857' }}>
                    <WorkIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Resume</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  {profile.resumeLink && (
                    <MuiLink href={profile.resumeLink} target="_blank" rel="noopener">View Resume</MuiLink>
                  )}
                  <label htmlFor="resume-upload">
                    <FileInput id="resume-upload" type="file" accept="application/pdf" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'resume')} />
                    <Button component="span" variant="outlined" disabled={uploading}>Upload PDF</Button>
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
