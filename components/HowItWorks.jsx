import { Box, Container, Typography, Grid, Paper, Icon } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const steps = [
  {
    title: 'Create',
    description: 'Input your study material or choose a topic',
    icon: CreateIcon,
    color: '#4CAF50',
  },
  {
    title: 'Learn',
    description: 'Review AI-generated flashcards',
    icon: SchoolIcon,
    color: '#2196F3',
  },
  {
    title: 'Improve',
    description: 'Track progress and master your subject',
    icon: TrendingUpIcon,
    color: '#FF9800',
  },
];

export default function HowItWorks() {
  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 8, fontWeight: 'bold' }}>
          How It Works
        </Typography>
        <Grid container spacing={6} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                <Icon component={step.icon} sx={{ fontSize: 60, color: step.color, mb: 2 }} />
                <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
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