import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Ready to Supercharge Your Learning?
        </Typography>
        <Typography variant="h6" align="center" paragraph>
          Join thousands of students who are already using FlashCard AI to master their subjects faster and more effectively.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            href="/sign-up"
          >
            Get Started for Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
