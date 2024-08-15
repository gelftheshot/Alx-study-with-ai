'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import Flashcard from '../../components/flashcard';

const Createcard = () => {
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useUser();

  const saveFlashcards = async () => {
    if (!user || flashcards.length === 0) return;

    setSaveLoading(true);
    try {
      const flashcardsRef = collection(db, 'users', user.id, 'flashcards');
      await addDoc(flashcardsRef, {
        topic,
        cards: flashcards,
        createdAt: new Date()
      });
      alert('Flashcards saved successfully!');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('Failed to save flashcards. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Flashcards
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              margin="normal"
              required
              multiline
              rows={6}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Number of Cards"
              type="number"
              value={cardCount}
              onChange={(e) => setCardCount(Math.min(30, Math.max(1, parseInt(e.target.value))))}
              inputProps={{ min: 1, max: 30 }}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Generating...' : 'Generate Flashcards'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {flashcards.length > 0 && (
        <>
          <Box sx={{ 
            mt: 4, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 3, 
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
            {flashcards.map((card, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Flashcard 
                  question={card.front} 
                  answer={card.back} 
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={saveFlashcards}
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Flashcards'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Createcard;