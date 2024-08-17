'use client';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import Flashcard from './flashcard';

const flashcardData = [
  { question: "What's the capital of France?", answer: "Paris" },
  { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
  { question: "What's the largest planet in our solar system?", answer: "Jupiter" },
  { question: "What's the chemical symbol for gold?", answer: "Au" },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
];

export default function Hero() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardData.length);
    }, 5000); // Flip every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
              <Flashcard
                question={flashcardData[currentCardIndex].question}
                answer={flashcardData[currentCardIndex].answer}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}