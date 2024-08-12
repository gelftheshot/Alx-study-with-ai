'use client';
import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function Hero() {
  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          FlashCard Pro
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Transform your text into interactive flashcards with our AI-powered tool. Learn faster and more efficiently.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Link href="/signup" passHref>
            <Button variant="contained" color="primary" component="a">
              Sign Up
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="outlined" color="primary" component="a">
              Log In
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}