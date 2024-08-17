'use client';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import AutoFlippingFlashcard from './AutoFlippingFlashcard';

const flashcardData = [
  { question: "What's the only food that doesn't spoil?", answer: "Honey" },
  { question: "Which planet has the most moons?", answer: "Saturn (82 moons)" },
  { question: "What's the loudest animal on Earth?", answer: "The sperm whale" },
  { question: "How many hearts does an octopus have?", answer: "Three" },
  { question: "What's the smallest bone in the human body?", answer: "The stapes (in the ear)" },
];

export default function Hero() {
  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
            >
              FlashCard AI
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Revolutionize your learning with AI-powered flashcards. Create, study, and master any subject effortlessly using our advanced natural language processing technology.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Our platform uses state-of-the-art AI to generate high-quality flashcards from any text, saving you time and enhancing your study experience. Perfect for students, professionals, and lifelong learners.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <SignedIn>
                <Button variant="contained" color="primary" component={Link} href="/create" size="large" sx={{ mr: 2 }}>
                  Create Flashcards
                </Button>
                <Button variant="outlined" color="primary" component={Link} href="/my-flashcards" size="large">
                  My Flashcards
                </Button>
              </SignedIn>
              <SignedOut>
                <Button variant="contained" color="primary" component={Link} href="/sign-up" size="large" sx={{ mr: 2 }}>
                  Get Started
                </Button>
                <Button variant="outlined" color="primary" component={Link} href="/sign-in" size="large">
                  Log In
                </Button>
              </SignedOut>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AutoFlippingFlashcard flashcardData={flashcardData} />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box component="footer" sx={{ mt: 8, py: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} FlashCard AI. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Made with ❤️ for learners everywhere
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}