import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import Link from 'next/link';
import { Add as AddIcon, ViewList as ViewListIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

export default function Dashboard() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Welcome to Your Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Create New Flashcards
              </Typography>
              <Typography paragraph sx={{ flexGrow: 1 }}>
                Start creating new flashcards to enhance your learning experience.
              </Typography>
              <Button variant="contained" color="primary" component={Link} href="/create" startIcon={<AddIcon />}>
                Create Flashcards
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <ViewListIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                My Flashcards
              </Typography>
              <Typography paragraph sx={{ flexGrow: 1 }}>
                Review and study your existing flashcard sets.
              </Typography>
              <Button variant="contained" color="primary" component={Link} href="/my-flashcards" startIcon={<ViewListIcon />}>
                View My Flashcards
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Progress Tracker
              </Typography>
              <Typography paragraph sx={{ flexGrow: 1 }}>
                Monitor your learning progress and set new goals.
              </Typography>
              <Button variant="contained" color="primary" component={Link} href="/progress" startIcon={<TrendingUpIcon />}>
                View Progress
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}