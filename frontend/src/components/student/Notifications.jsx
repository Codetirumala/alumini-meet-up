import { Box, Container, Typography } from '@mui/material';

export default function Notifications() {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Notifications</Typography>
        <Typography color="text.secondary">No notifications yet.</Typography>
      </Container>
    </Box>
  );
}
