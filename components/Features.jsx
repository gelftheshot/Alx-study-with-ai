import { Box, Container, Grid, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';

const features = [
  {
    title: 'AI-Powered Conversion',
    description: 'Instantly turn your text into well-structured flashcards.',
    icon: <SchoolIcon sx={{ fontSize: 64 }} />,
  },
  {
    title: 'Fast and Efficient',
    description: 'Create hundreds of flashcards in seconds, saving you time and effort.',
    icon: <SpeedIcon sx={{ fontSize: 64 }} />,
  },
  {
    title: 'Cross-Platform',
    description: 'Access your flashcards on any device, anytime, anywhere.',
    icon: <DevicesIcon sx={{ fontSize: 64 }} />,
  },
];

export default function Features() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}