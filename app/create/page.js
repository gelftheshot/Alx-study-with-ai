'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Createcard = () => {
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setFlashcards(data.flashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
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
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Answer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flashcards.map((card, index) => (
                <TableRow key={index}>
                  <TableCell>{card.front}</TableCell>
                  <TableCell>{card.back}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Createcard;