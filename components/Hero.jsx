'use client';
import { Box, Button, Container, Typography, Grid, Image } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import AutoFlippingFlashcard from './AutoFlippingFlashcard';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import Dashboard from './Dashboard';

const flashcardData = [
  { question: "What's the only food that doesn't spoil?", answer: "Honey" },
  { question: "Which planet has the most moons?", answer: "Saturn (82 moons)" },
  { question: "What's the loudest animal on Earth?", answer: "The sperm whale" },
  { question: "How many hearts does an octopus have?", answer: "Three" },
  { question: "What's the smallest bone in the human body?", answer: "The stapes (in the ear)" },
];

export default function Hero() {
  const { isSignedIn } = useUser();

  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        {isSignedIn ? (
          <Dashboard />
        ) : (
          <>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  component="h1"
                  variant="h2"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 4 }}
                >
                  FlashCard AI
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Revolutionize your learning with AI-powered flashcards. Create, study, and master any subject effortlessly.
                </Typography>
                <Box sx={{ mt: 6 }}>
                  <Button variant="contained" color="primary" component={Link} href="/sign-up" size="large" sx={{ mr: 2, px: 4, py: 1.5 }}>
                    Get Started
                  </Button>
                  <Button variant="outlined" color="primary" component={Link} href="/sign-in" size="large" sx={{ px: 4, py: 1.5 }}>
                    Log In
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <AutoFlippingFlashcard flashcardData={flashcardData} />
                </Box>
              </Grid>
            </Grid>
            <Features />
            <HowItWorks />
            <Testimonials />
            <CallToAction />
          </>
        )}
      </Container>
    </Box>
  );
}