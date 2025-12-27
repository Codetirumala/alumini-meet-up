import { Container, Typography, Box, Button, Grid, Card, CardContent, alpha, useTheme, Avatar, Chip, IconButton, Collapse, useMediaQuery, Fab, Zoom } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HandshakeIcon from '@mui/icons-material/Handshake';
import InsightsIcon from '@mui/icons-material/Insights';
import GavelIcon from '@mui/icons-material/Gavel';
import PublicIcon from '@mui/icons-material/Public';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import homeImage1 from '../images/home1.jpg';
import homeImage2 from '../images/home2.jpg';
import homeImage3 from '../images/home3.jpg';
import workShapeImage from '../images/work_shape02.png';
import marqueeImg from '../images/marque-img.webp';

import AlumniHubRoadmap from './AlumniHubRoadmap';
import Loader from '../components/common/Loader';
// Alumni 

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  
  const heroImages = [homeImage1, homeImage2, homeImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
    // Initial loader: wait for window load with a minimum display time
    useEffect(() => {
      const minDuration = 5000; // ms (5 seconds splash)
      const start = Date.now();

      const finish = () => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(minDuration - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      };

      if (document.readyState === 'complete') {
        finish();
      } else {
        window.addEventListener('load', finish, { once: true });
        return () => window.removeEventListener('load', finish);
      }
    }, []);

  // Testimonials carousel state declared after testimonials array

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const features = [
    {
      icon: <GroupIcon sx={{ fontSize: 48 }} />,
      title: 'Connect with Alumni',
      description: 'Build your professional network with alumni from your institution',
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    },
    {
      icon: <WorkIcon sx={{ fontSize: 48 }} />,
      title: 'Job Opportunities',
      description: 'Discover and post job openings exclusive to our alumni community',
      color: '#2e7d32',
      gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
    },
    {
      icon: <EventIcon sx={{ fontSize: 48 }} />,
      title: 'Networking Events',
      description: 'Attend events and reunions to strengthen your professional connections',
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
    },
    {
      icon: <StarIcon sx={{ fontSize: 48 }} />,
      title: 'Mentorship Program',
      description: 'Get guidance from experienced professionals in your field',
      color: '#d32f2f',
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      title: 'Career Resources',
      description: 'Access exclusive career resources and professional development tools',
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
      title: 'Verified Profiles',
      description: 'Connect with verified alumni profiles ensuring authentic networking',
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    },
  ];

  // Services list for marquee (reuse feature titles)
  const services = features.map((f) => ({ title: f.title }));

  // FAQs content
  const faqs = [
    {
      question: 'What is Alumni Hub?',
      answer:
        'Alumni Hub is a modern platform that connects alumni, students, and institutions for mentoring, jobs, and events — all in one secure, curated space.',
    },
    {
      question: 'How does the platform work?',
      answer:
        'Create a verified profile, explore alumni directories, join events, request mentorship, and discover job opportunities. Everything is optimized for genuine, professional connections.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes. We apply industry-standard encryption, role-based access, and periodic audits to keep your personal data safe and private.',
    },
    {
      question: 'Can alumni post jobs or events?',
      answer:
        'Absolutely. Verified alumni and admins can post jobs, internships, and events. Listings are reviewed to maintain quality and relevance.',
    },
    {
      question: 'Is Alumni Hub free to use?',
      answer:
        'Students can join for free. Institutions and alumni organizations may use premium features for advanced analytics and integrations.',
    },
    {
      question: 'How do students contact alumni?',
      answer:
        'Through controlled messaging and mentorship requests. We encourage clear goals and respectful communication to maximize outcomes.',
    },
    {
      question: 'Do you support global communities?',
      answer:
        'Yes. Our tooling supports international chapters, time zones, and event management so global alumni can collaborate smoothly.',
    },
    {
      question: 'Can institutions customize Alumni Hub?',
      answer:
        'We offer white-label options, SSO, and tailored modules for universities and alumni associations that need deeper customization.',
    },
  ];

  const faqColumns = useMemo(() => {
    const mid = Math.ceil(faqs.length / 2);
    return [faqs.slice(0, mid), faqs.slice(mid)];
  }, [faqs]);

  const [expandedFaq, setExpandedFaq] = useState(null);

  const stats = [
    { icon: <PeopleIcon />, value: '10K+', label: 'Active Alumni', color: '#1976d2' },
    { icon: <BusinessCenterIcon />, value: '5K+', label: 'Job Postings', color: '#2e7d32' },
    { icon: <CalendarTodayIcon />, value: '500+', label: 'Events Hosted', color: '#f57c00' },
    { icon: <VerifiedUserIcon />, value: '98%', label: 'Satisfaction Rate', color: '#d32f2f' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Tech Corp',
      avatar: 'SJ',
      quote: 'Alumni Hub connected me with amazing mentors who guided my career transition. The networking events are incredible!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Innovate Inc',
      avatar: 'MC',
      quote: 'Found my dream job through Alumni Hub. The platform makes it so easy to connect with alumni in my field.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'Brand Solutions',
      avatar: 'ER',
      quote: 'As an alumna, I love giving back by mentoring students. This platform makes mentorship seamless and rewarding.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Data Scientist',
      company: 'Insight Labs',
      avatar: 'PS',
      quote: 'Mentor sessions helped me switch roles confidently. Loved the structured check-ins!',
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      role: 'UX Designer',
      company: 'Craft Studio',
      avatar: 'AM',
      quote: 'The alumni projects and hack nights were perfect to build my portfolio.',
      rating: 5,
    },
    {
      name: 'Nisha Patel',
      role: 'HR Manager',
      company: 'PeopleFirst',
      avatar: 'NP',
      quote: 'Referrals through Alumni Hub made hiring faster and more reliable,secure.',
      rating: 5,
    },
  ];

  // Testimonials: 2-per-page exact carousel (moved after testimonials definition)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const perPage = isMobile ? 1 : 2;
  const testimonialPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < testimonials.length; i += perPage) {
      pages.push(testimonials.slice(i, i + perPage));
    }
    return pages;
  }, [testimonials, perPage]);
  const [testimonialPage, setTestimonialPage] = useState(0);
  useEffect(() => {
    if (testimonialPages.length <= 1) return;
    const id = setInterval(() => {
      setTestimonialPage((p) => (p + 1) % testimonialPages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonialPages.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', overflow: 'hidden', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000', // Dark background to prevent white flash
        }}
      >
        {/* Image Carousel - All images stacked, only current one visible */}
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: index === currentImageIndex ? 1 : 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              zIndex: index === currentImageIndex ? 1 : 0,
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </motion.div>
        ))}

        {/* Light overlay for text readability - minimal to keep image clear */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.15)',
            zIndex: 0,
          }}
        />
        
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 1, 
            py: { xs: 8, md: 12 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%' }}
          >
            <Box 
              sx={{ 
                textAlign: 'center',
                maxWidth: '900px',
                mx: 'auto',
                px: { xs: 2, sm: 3, md: 4 },
                width: '100%',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: { xs: 2, sm: 3, md: 4 },
                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                    color: 'white',
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.4)',
                    lineHeight: { xs: 1.2, md: 1.1 },
                    textAlign: 'center',
                    display: 'block',
                    wordBreak: 'break-word',
                  }}
                >
                  Welcome to Alumni Hub
                </Typography>
                {/* <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: { xs: 4, sm: 5, md: 6 }, 
                    maxWidth: '750px', 
                    mx: 'auto',
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' },
                    fontWeight: 400,
                    lineHeight: { xs: 1.6, md: 1.7 },
                    color: 'rgba(255, 255, 255, 0.98)',
                    textShadow: '1px 1px 6px rgba(0, 0, 0, 0.6)',
                    textAlign: 'center',
                    display: 'block',
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  Connect, collaborate, and grow with your alumni community. 
                  Build lasting professional relationships and unlock new opportunities.
                </Typography> */}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {!user ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: { xs: 2, sm: 3 }, 
                      justifyContent: 'center', 
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      width: '100%',
                      mt: { xs: 2, sm: 3 },
                    }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/register')}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          background: 'white',
                          color: '#1976d2',
                          fontWeight: 700,
                          px: { xs: 4, sm: 5 },
                          py: { xs: 1.5, sm: 1.8 },
                          fontSize: { xs: '0.95rem', sm: '1.1rem' },
                          borderRadius: '50px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                          textTransform: 'none',
                          minWidth: { xs: '160px', sm: '200px' },
                          '&:hover': {
                            background: '#f5f5f5',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Get Started Free
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                          borderColor: 'white',
                          borderWidth: 2,
                          color: 'white',
                          fontWeight: 700,
                          px: { xs: 4, sm: 5 },
                          py: { xs: 1.5, sm: 1.8 },
                          fontSize: { xs: '0.95rem', sm: '1.1rem' },
                          borderRadius: '50px',
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          textTransform: 'none',
                          minWidth: { xs: '160px', sm: '200px' },
                          '&:hover': {
                            borderColor: 'white',
                            background: 'rgba(255, 255, 255, 0.25)',
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Box>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        if (user.role === 'admin') navigate('/admin');
                        else if (user.role === 'alumni') navigate('/alumni');
                        else navigate('/student');
                      }}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: 'white',
                        color: '#1976d2',
                        fontWeight: 700,
                        px: { xs: 4, sm: 5 },
                        py: { xs: 1.5, sm: 1.8 },
                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                        borderRadius: '50px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                        textTransform: 'none',
                        minWidth: { xs: '200px', sm: '240px' },
                        '&:hover': {
                          background: '#f5f5f5',
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 12 }, 
          background: 'white',
          position: 'relative', 
          zIndex: 2,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 1.5px, transparent 1.5px)',
            backgroundSize: '22px 22px',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        {/* Decorative images with floating motion */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -16, 0, 16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, right: 0, zIndex: 0, pointerEvents: 'none' }}
        >
          <Box
            component="img"
            src={workShapeImage}
            alt=""
            sx={{
              position: 'absolute',
              top: { xs: 20, md: 40 },
              right: { xs: 20, md: 40 },
              width: { xs: '120px', sm: '150px', md: '200px' },
              height: 'auto',
              opacity: 0.4, // Increased visibility
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        </motion.div>
        <Box
          component="img"
          src={workShapeImage}
          alt=""
          sx={{
            position: 'absolute',
            bottom: { xs: 20, md: 40 },
            left: { xs: 20, md: 40 },
            width: { xs: '120px', sm: '150px', md: '200px' },
            height: 'auto',
            opacity: 0.6,
            zIndex: 0,
            pointerEvents: 'none',
            transform: 'rotate(180deg)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
              <Chip
                label="Features"
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 1,
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Power up your online presence
              </Typography>
              <Typography variant="body1" color="#6b7280" sx={{ maxWidth: 600, mx: 'auto' }}>
                Unlock amazing features designed to connect and grow
              </Typography>
            </Box>
          </motion.div>

          <Grid 
            container 
            spacing={{ xs: 3, sm: 4, md: 5 }}
            sx={{
              justifyContent: 'center',
              alignItems: 'stretch',
            }}
          >
            {stats.map((stat, index) => (
              <Grid 
                item 
                xs={6} 
                sm={6} 
                md={3} 
                key={index}
                sx={{
                  display: 'flex',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                  style={{ width: '100%' }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: { xs: 3, sm: 4, md: 5 },
                      background: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#10B981',
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                        color: 'rgba(0, 0, 0, 0.7)',
                        lineHeight: 1.5,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 30%, #f0fdf4 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '24px',
            borderTopLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            py: { xs: 6, md: 8 },
            px: { xs: 3, sm: 4, md: 6 },
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
          }}
        >
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
              <Chip
                label="Services"
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 1,
                  mb: 2,
                }}
              />
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Alumni Hub Services
                </Typography>
              </motion.div>
              <Typography variant="body1" color="#6b7280" sx={{ maxWidth: 600, mx: 'auto' }}>
                Explore all the tools and features we offer
              </Typography>
            </Box>

            <Grid 
              container 
              spacing={{ xs: 2, sm: 2.5, md: 2.5 }}
              sx={{
                justifyContent: 'center',
                maxWidth: '1200px',
                mx: 'auto',
              }}
            >
              {features.map((feature, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div 
                    variants={itemVariants} 
                    whileHover={{ y: -8 }}
                    style={{ width: '100%', maxWidth: '320px' }}
                  >
                    <Card
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)',
                        borderTopLeftRadius: '16px',
                        borderBottomRightRadius: '16px',
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        position: 'relative',
                        pt: 3,
                        pb: 2,
                        px: 0,
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                        border: 'none',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2), 0 2px 4px rgba(0, 0, 0, 0.12)',
                          
                        },
                      }}
                    >
                      {/* Green Left Accent Bar */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '10%',
                          bottom: '70%',
                          width: '4px',
                          background: '#10B981',
                          zIndex: 1,
                        }}
                      />

                      {/* Circular Icon at Top */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -24,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          zIndex: 2,
                        }}
                      >
                        <Box
                          sx={{
                            color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid #10B981`,
                            borderRadius: '50%',
                            width: '100%',
                            height: '100%',
                            '& svg': {
                              fontSize: 32,
                            },
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </Box>

                      {/* Card Content */}
                      <Box 
                        sx={{ 
                          flexGrow: 1, 
                          display: 'flex', 
                          flexDirection: 'column',
                          mt: 3,
                          px: 3,
                          height: '100%',
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 1.5, 
                            color: '#1a1a1a',
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                            lineHeight: 1.3,
                            textAlign: 'center',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(0, 0, 0, 0.6)',
                            lineHeight: 1.6,
                            flexGrow: 1,
                            mb: 2,
                            fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                            textAlign: 'center',
                          }}
                        >
                          {feature.description}
                        </Typography>
                        
                        {/* Learn More Link */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            mt: 'auto',
                            cursor: 'pointer',
                            color: '#1a1a1a',
                            '&:hover': {
                              color: '#10B981',
                            },
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              mr: 0.5,
                              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            }}
                          >
                            Learn more
                          </Typography>
                          <ArrowForwardIcon 
                            sx={{ 
                              fontSize: 18, 
                              color: '#10B981',
                            }} 
                          />
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Alumni Roadmap Section */}
      <AlumniHubRoadmap />

     
  
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="Testimonials"
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
                color: 'white',
                fontWeight: 600,
                px: 1,
                mb: 2,
              }}
            />
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                What Our Community Says
              </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              Real stories from alumni and students who are making a difference
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', width: '100%', transition: 'transform 0.6s ease', transform: `translateX(-${testimonialPage * 100}%)` }}>
              {testimonialPages.map((group, pageIdx) => (
                <Box key={pageIdx} sx={{ flex: '0 0 100%' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 3, sm: 4 }, px: { xs: 2, sm: 0 } }}>
                    {group.map((testimonial, index) => (
                      <Box key={`${pageIdx}-${index}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -8 }}
                        >
                          <Card
                            sx={{
                              height: '100%',
                              aspectRatio: { xs: '1/1', sm: 'auto' },
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              p: { xs: 3, sm: 4 },
                              background: 'white',
                              borderRadius: { xs: '20px', sm: '24px' },
                              position: 'relative',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
                              },
                            }}
                          >
                            <FormatQuoteIcon
                              sx={{
                                position: 'absolute',
                                top: { xs: 16, sm: 20 },
                                right: { xs: 16, sm: 20 },
                                fontSize: { xs: 40, sm: 60 },
                                color: alpha('#10B981', 0.12),
                              }}
                            />
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <StarIcon key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                              ))}
                            </Box>
                            <Typography variant="body1" sx={{ mb: { xs: 2, sm: 3 }, lineHeight: 1.8, color: 'text.primary', fontStyle: 'italic', fontSize: { xs: '0.9rem', sm: '1rem' }, flex: 1 }}>
                              "{testimonial.quote}"
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                              <Avatar
                                sx={{
                                  width: { xs: 48, sm: 56 },
                                  height: { xs: 48, sm: 56 },
                                  background: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
                                  fontWeight: 700,
                                  fontSize: { xs: '1rem', sm: '1.2rem' },
                                }}
                              >
                                {testimonial.avatar}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                  {testimonial.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                  {testimonial.role} at {testimonial.company}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </motion.div>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2 }, mt: { xs: 4, sm: 3 } }}>
            <IconButton
              onClick={() => setTestimonialPage((p) => (p - 1 + testimonialPages.length) % testimonialPages.length)}
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                border: { xs: '2px solid #10B981', sm: '3px solid #10B981' },
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.18)',
                '&:hover': { background: 'rgba(16,185,129,0.08)' },
              }}
            >
              <ArrowBackIosNewIcon sx={{ color: '#10B981', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
            <IconButton
              onClick={() => setTestimonialPage((p) => (p + 1) % testimonialPages.length)}
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                border: { xs: '2px solid #10B981', sm: '3px solid #10B981' },
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.18)',
                '&:hover': { background: 'rgba(16,185,129,0.08)' },
              }}
            >
              <ArrowForwardIosIcon sx={{ color: '#10B981' }} />
            </IconButton>
          </Box>
        </motion.div>
      </Container>

      {/* Marquee Section (replaces CTA) */}
      {!user && (
        <>
          <style>{`
          .marquee-section {
            position: relative;
            height: 650px;
            background-image:
              url('${marqueeImg}'),
              linear-gradient(180deg, #10B981 10%, #047857 80%);
            background-size: 70%, cover;
            background-repeat: no-repeat, no-repeat;
            background-position: center center, center center;
            display: flex;
            align-items: center;
            overflow: hidden;
          }
          .marquee-section::after { content: none; }
          .marquee-container {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            transform: translateY(-50%);
            z-index: 1;
          }
          .marquee { width: 100%; overflow: hidden; position: relative; }
          .marquee-top { }
          .marquee-bottom { margin-top: 2rem; }
          .marquee-content { display: flex; width: fit-content; animation: marquee 30s linear infinite; }
          .marquee-content.reverse { animation: marquee-reverse 30s linear infinite; }
          .marquee-content span { font-size: 6rem; font-weight: 800; color: #fff; text-transform: uppercase; padding: 0 2rem; flex-shrink: 0; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); }
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes marquee-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
          @media (max-width: 900px){ .marquee-content span { font-size: 2.5rem; padding: 0 1rem; } }
          `}</style>

          <section className="marquee-section">
            <div className="marquee-container">
              <div className="marquee marquee-top">
                <div className="marquee-content">
                  {[...services, ...services].map((service, index) => (
                    <span key={`top-${index}`}>{service.title}</span>
                  ))}
                </div>
              </div>
              <div className="marquee marquee-bottom">
                <div className="marquee-content reverse">
                  {[...services, ...services].map((service, index) => (
                    <span key={`bottom-${index}`}>{service.title}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FAQ Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'white',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
              <Chip
                label="FAQ"
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 1,
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '1.85rem', md: '2.75rem' },
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Frequently Asked Questions
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
                Clear answers about how Alumni Hub helps you connect, grow, and succeed.
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, md: 4 } }}>
            {faqs.map((item, idx) => {
              const key = `faq-${idx}`;
              const isOpen = expandedFaq === key;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Accordion
                    elevation={0}
                    expanded={isOpen}
                    onChange={() => setExpandedFaq(isOpen ? null : key)}
                    sx={{
                      bgcolor: 'transparent',
                      borderTop: '1px solid rgba(16,185,129,0.25)',
                      borderBottom: '1px solid rgba(16,185,129,0.10)',
                      '&::before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        isOpen ? (
                          <RemoveRoundedIcon sx={{ color: '#10B981' }} />
                        ) : (
                          <AddRoundedIcon sx={{ color: '#10B981' }} />
                        )
                      }
                      sx={{
                        px: { xs: 0.5, md: 1 },
                        py: { xs: 1.25, md: 1.75 },
                        '& .MuiAccordionSummary-content': { alignItems: 'center', m: 0 },
                        '&:hover': { backgroundColor: 'rgba(16,185,129,0.06)' },
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: { xs: 1.5, md: 2 } }}>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 40 },
            right: { xs: 20, md: 40 },
            zIndex: 1000,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(16, 185, 129, 0.6)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '200%',
                  height: '200%',
                  background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'translate(-50%, -50%) rotate(0deg)',
                  animation: 'spin 3s linear infinite',
                },
                '@keyframes spin': {
                  '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                  '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                },
              }}
            >
              <KeyboardArrowUpIcon 
                sx={{ 
                  color: 'white', 
                  fontSize: { xs: 32, md: 36 },
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }} 
              />
            </Box>
          </motion.div>
        </Box>
      </Zoom>
    </Box>
  );
};

export default Home;
