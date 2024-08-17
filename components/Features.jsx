import { Box, Container, Grid, Typography, Card, CardContent, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';

const features = [
  {
    title: 'AI-Powered Creation',
    description: 'Instantly generate well-structured flashcards from any text.',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    color: '#4CAF50',
  },
  {
    title: 'Fast and Efficient',
    description: 'Create hundreds of flashcards in seconds, saving you time and effort.',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    color: '#2196F3',
  },
  {
    title: 'Study Anywhere',
    description: 'Access your flashcards on any device, anytime, anywhere.',
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    color: '#FF9800',
  },
];

export default function Features() {
  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 8, fontWeight: 'bold' }}>
          Features
        </Typography>
        <Grid container spacing={6} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: feature.color, mx: 'auto', mb: 3 }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
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