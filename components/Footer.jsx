import { Box, Container, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} FlashCard AI. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="/privacy">
            Privacy Policy
          </Link>
          {' | '}
          <Link color="inherit" href="/terms">
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
