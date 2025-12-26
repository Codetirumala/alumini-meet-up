import { Box, Container, Typography } from '@mui/material';

export default function Mentorship() {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Mentorship</Typography>
        <Typography color="text.secondary">Feature coming soon: request mentorship from alumni, track status.</Typography>
      </Container>
    </Box>
  );
}
