import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 6, borderRadius: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Ready to revolutionize your learning?
          </Typography>
          <Typography variant="h5" align="center" paragraph sx={{ mb: 6 }}>
            Join thousands of students mastering subjects effortlessly with AI-powered flashcards.
          </Typography>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                href="/sign-up"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                href="/sign-in"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderColor: 'primary.contrastText', '&:hover': { borderColor: 'primary.contrastText', bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                Log In
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}