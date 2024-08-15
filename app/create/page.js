'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid } from '@mui/material';

const Createcard = () => {
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send topic and cardCount to backend AI for processing
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: topic, count: cardCount }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      console.log('Generated flashcards:', data.flashcards);
      // TODO: Handle the generated flashcards (e.g., save to database, display to user)
    } catch (error) {
      console.error('Error generating flashcards:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Flashcards
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Cards"
              type="number"
              value={cardCount}
              onChange={(e) => setCardCount(Math.min(30, Math.max(1, parseInt(e.target.value))))}
              inputProps={{ min: 1, max: 30 }}
              margin="normal"
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Generate Flashcards
        </Button>
      </Box>
    </Container>
  );
};

export default Createcard;