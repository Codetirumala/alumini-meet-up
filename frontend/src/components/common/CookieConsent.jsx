import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Stack, Link, Switch, FormControlLabel } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CookieConsent
 * Animated, themed consent banner.
 * - Persists consent in localStorage: cookieConsent = { accepted: true, ts }
 * - Accessible, keyboard friendly
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cookieConsent');
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || parsed.accepted !== true) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ accepted: true, ts: Date.now(), prefs }));
    setOpen(false);
  };

  const savePrefs = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ accepted: true, ts: Date.now(), prefs }));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <Box
          component={motion.div}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 250, damping: 22 }}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: 1600,
          }}
          aria-live="polite"
        >
          <Paper
            elevation={8}
            sx={{
              p: 1.25,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              border: '1px solid',
              borderColor: alpha('#10B981', 0.3),
              background: `linear-gradient(135deg, ${alpha('#10B981', 0.12)} 0%, ${alpha('#10B981', 0.06)} 100%)`,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: `0 6px 16px ${alpha('#10B981', 0.35)}`,
            }}>🍪</Box>

            <Typography variant="body2" sx={{ px: 1, color: '#065F46', fontWeight: 600 }}>
              Cookies help us enhance your experience.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ pl: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setManage((v) => !v)}
                sx={{
                  borderColor: alpha('#10B981', 0.4),
                  color: '#065F46',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#10B981', backgroundColor: alpha('#10B981', 0.1) },
                }}
              >
                Manage
              </Button>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={accept}
                sx={{
                  backgroundColor: '#10B981',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 1.5,
                  boxShadow: `0 6px 14px ${alpha('#10B981', 0.25)}`,
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                Accept
              </Button>
            </Stack>
          </Paper>

          <AnimatePresence>
            {manage && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                sx={{ mt: 1 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#10B981', 0.25),
                    background: 'white',
                    minWidth: 300,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065F46', mb: 1 }}>
                    Preferences
                  </Typography>
                  <Stack spacing={0.5}>
                    <FormControlLabel disabled control={<Switch checked />} label={<Typography variant="body2">Essential cookies (required)</Typography>} />
                    <FormControlLabel control={<Switch checked={prefs.analytics} onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))} />} label={<Typography variant="body2">Analytics (usage insights)</Typography>} />
                    <FormControlLabel control={<Switch checked={prefs.marketing} onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))} />} label={<Typography variant="body2">Marketing (personalized content)</Typography>} />
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                    <Button size="small" variant="text" onClick={() => setManage(false)}>Close</Button>
                    <Button size="small" variant="contained" color="success" onClick={savePrefs} sx={{ textTransform: 'none' }}>Save</Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    See our <Link href="#" underline="hover" sx={{ color: '#047857', fontWeight: 600 }}>Privacy Policy</Link>.
                  </Typography>
                </Paper>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      )}
    </AnimatePresence>
  );
}
