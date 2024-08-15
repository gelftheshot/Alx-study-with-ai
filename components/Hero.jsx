'use client';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from 'next/image';

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
              Transform your learning with AI-powered flashcards. Create, study, and master any subject effortlessly.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <SignedIn>
                <Button variant="contained" color="primary" component={Link} href="/create" size="large">
                  Create Flashcards
                </Button>
              </SignedIn>
              <SignedOut>
                <Button variant="contained" color="primary" component={Link} href="/sign-up" size="large">
                  Get Started
                </Button>
              </SignedOut>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Image
              src="/flashcard-illustration.png"
              alt="Flashcard Illustration"
              width={500}
              height={400}
              layout="responsive"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}