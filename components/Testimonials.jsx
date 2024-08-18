import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Medical Student',
    content: 'FlashCard AI has revolutionized my study routine. I can quickly create flashcards for complex medical terms and concepts.',
    initials: 'SL',
  },
  {
    name: 'Mike T.',
    role: 'Language Learner',
    content: 'Learning a new language has never been easier. The AI-generated flashcards are spot-on and save me hours of manual work.',
    initials: 'MT',
  },
  {
    name: 'Emily R.',
    role: 'High School Teacher',
    content: 'I use FlashCard AI to create study materials for my students. It&apos;s a game-changer for both me and my class!',
    initials: 'ER',
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" paragraph>
                    &quot;{testimonial.content}&quot;
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                      {testimonial.initials}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{testimonial.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}