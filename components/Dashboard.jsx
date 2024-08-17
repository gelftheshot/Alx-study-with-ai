import { Box, Container, Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'primary.main', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Create New Flashcards
              </Typography>
              <Typography paragraph>
                Start creating new flashcards to enhance your learning experience.
              </Typography>
              <Button variant="contained" color="primary" component={Link} href="/create">
                Create Flashcards
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'primary.main', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                My Flashcards
              </Typography>
              <Typography paragraph>
                Review and study your existing flashcard sets.
              </Typography>
              <Button variant="contained" color="primary" component={Link} href="/my-flashcards">
                View My Flashcards
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
