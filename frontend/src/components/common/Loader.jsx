import React from 'react';
import { Box, Typography } from '@mui/material';
import '../../styles/loader.css';

const Loader = () => {
  return (
    <div className="loader-container" role="status" aria-live="polite" aria-label="Loading">
      <div className="loader" aria-hidden="true" />
      <Box sx={{ textAlign: 'center' }}>
      <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Alumni Hub
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                Connect • Grow • Succeed
              </Typography>
            </Box>
    </div>
  );
};

export default Loader;
