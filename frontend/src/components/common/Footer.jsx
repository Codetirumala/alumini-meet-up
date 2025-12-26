import { Box, Container, Grid, Typography, Link, IconButton, Divider, alpha, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'About Alumni Hub', href: '#' },
        { label: 'Our Team', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Community', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Disclaimer', href: '#' },
      ],
    },
  ];

  const socialIcons = [
    { icon: <FacebookIcon />, color: '#10B981', href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, color: '#10B981', href: '#', label: 'Twitter' },
    { icon: <LinkedInIcon />, color: '#10B981', href: '#', label: 'LinkedIn' },
    { icon: <InstagramIcon />, color: '#10B981', href: '#', label: 'Instagram' },
  ];

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'white',
        color: '#1f2937',
        py: { xs: 5, md: 8 },
        mt: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Main Footer Content */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Grid container spacing={{ xs: 2.5, md: 4 }} mb={4}>
            {/* Brand Section */}
            <Grid item xs={12} sm={6} md={3.5}>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Alumni Hub
                  </Typography>
                </Box>
                <Typography variant="body2" color="#6b7280" sx={{ lineHeight: 1.8, mb: 2.5 }}>
                  Connecting alumni with students to create opportunities for growth, mentorship, and lasting professional relationships.
                </Typography>

                {/* Contact Info */}
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <EmailIcon sx={{ fontSize: 18, color: '#10B981' }} />
                    <Typography variant="body2" color="#6b7280" sx={{ fontSize: '0.85rem' }}>
                      contact@alumnihub.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: '#10B981' }} />
                    <Typography variant="body2" color="#6b7280" sx={{ fontSize: '0.85rem' }}>
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: '#10B981', mt: 0.2 }} />
                    <Typography variant="body2" color="#6b7280" sx={{ fontSize: '0.85rem' }}>
                      123 Education Lane, University City, ST 12345
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <Grid item xs={12} sm={6} md={2.2} key={index}>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1.5, 
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      color: '#1f2937',
                      position: 'relative',
                      paddingBottom: 0.8,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '25px',
                        height: '2px',
                        background: 'linear-gradient(90deg, #10B981, #059669)',
                        borderRadius: '2px',
                      }
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        sx={{
                          color: '#6b7280',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          width: 'fit-content',
                          '&:hover': {
                            color: '#10B981',
                            transform: 'translateX(4px)',
                          },
                          '& .arrow': {
                            opacity: 0,
                            transform: 'translateX(-8px)',
                            transition: 'all 0.3s ease',
                          },
                          '&:hover .arrow': {
                            opacity: 1,
                            transform: 'translateX(0)',
                          },
                        }}
                      >
                        <span className="arrow" style={{ fontSize: '0.8rem' }}>→</span>
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            ))}

            {/* Newsletter */}
            <Grid item xs={12} sm={12} md={3.3}>
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1.5, 
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: '#1f2937',
                    position: 'relative',
                    paddingBottom: 0.8,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '25px',
                      height: '2px',
                      background: 'linear-gradient(90deg, #10B981, #059669)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  Stay Updated
                </Typography>
                <Typography variant="body2" color="#6b7280" sx={{ mb: 1.8, fontSize: '0.85rem' }}>
                  Subscribe for exclusive opportunities and alumni stories.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Your email"
                    variant="outlined"
                    size="small"
                    type="email"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#f9fafb',
                        color: '#1f2937',
                        borderColor: '#e5e7eb',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#10B981',
                          background: 'white',
                        },
                        '&.Mui-focused': {
                          borderColor: '#10B981',
                          background: 'white',
                          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#9ca3af',
                        opacity: 1,
                      },
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      py: 1.2,
                      border: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: { xs: 2, md: 1.5 },
              flexDirection: { xs: 'column-reverse', sm: 'row' }
            }}
          >
            <Typography variant="body2" color="#9ca3af" sx={{ textAlign: { xs: 'center', sm: 'left' }, fontSize: '0.85rem' }}>
              © {currentYear} Alumni Hub. All rights reserved. | Built with <span style={{ color: '#10B981' }}>❤</span> for the alumni community
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialIcons.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <IconButton
                    href={social.href}
                    title={social.label}
                    sx={{
                      color: '#10B981',
                      background: '#f0fdf4',
                      border: '1.5px solid #d1fae5',
                      width: { xs: 44, sm: 48 },
                      height: { xs: 44, sm: 48 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        borderColor: '#10B981',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                      },
                    }}
                    size="small"
                  >
                    {social.icon}
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
