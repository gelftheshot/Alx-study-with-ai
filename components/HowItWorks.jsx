import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const steps = [
  {
    title: 'Create',
    description: 'Input your study material or choose a topic',
    icon: <CreateIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Learn',
    description: 'Review AI-generated flashcards',
    icon: <SchoolIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Improve',
    description: 'Track progress and master your subject',
    icon: <TrendingUpIcon fontSize="large" color="primary" />,
  },
];

export default function HowItWorks() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {step.icon}
                <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
