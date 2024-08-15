import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';

const features = [
  {
    title: 'AI-Powered Creation',
    description: 'Instantly generate well-structured flashcards from any text.',
    icon: <SchoolIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
  {
    title: 'Fast and Efficient',
    description: 'Create hundreds of flashcards in seconds, saving you time and effort.',
    icon: <SpeedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
  {
    title: 'Study Anywhere',
    description: 'Access your flashcards on any device, anytime, anywhere.',
    icon: <DevicesIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
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
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {feature.icon}
                  <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}