import { Box, Container, Typography } from '@mui/material';

export default function SavedItems() {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Saved Items</Typography>
        <Typography color="text.secondary">Save jobs, alumni, and events for quick access. (Coming soon)</Typography>
      </Container>
    </Box>
  );
}
