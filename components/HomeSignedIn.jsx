import { Box, Container, Typography } from '@mui/material';
import Dashboard from './Dashboard';

export default function HomeSignedIn() {
  return (
    <Box>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mt: 4 }}>
          Welcome back!
        </Typography>
        <Dashboard />
      </Container>
    </Box>
  );
}
