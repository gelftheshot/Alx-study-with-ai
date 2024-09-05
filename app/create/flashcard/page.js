'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Paper, Slider } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Flashcard from '../../../components/flashcard';
import TopicOrFileInput from '../../../components/TopicOrFileInput';

const Createcard = () => {
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [cardCount, setCardCount] = useState(10);
  const [difficulty, setDifficulty] = useState(50);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useUser();

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
    setFile(null);
  };

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setTopic(uploadedFile.name);
  };

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

  const handleGenerateFlashcards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('count', cardCount.toString());
        formData.append('difficulty', difficulty.toString());

        response = await fetch('/api/generatefrompdf/flashcard', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/generate/flashcard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: topic, count: cardCount, difficulty }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data.flashcards);
    } catch (err) {
      console.error('Error generating flashcards:', err);
      if (err.message.includes('Resource has been exhausted')) {
        setError('Were experiencing high demand. Please try again in a few minutes.');
      } else {
        setError(`Failed to generate flashcards: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Flashcards
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={9}>
              <TopicOrFileInput onTopicChange={handleTopicChange} onFileUpload={handleFileUpload} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  fullWidth
                  label="Number of Cards"
                  type="number"
                  value={cardCount}
                  onChange={(e) => setCardCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                  inputProps={{ min: 1, max: 30 }}
                  margin="normal"
                  required
                />
                <Typography gutterBottom>Difficulty: {difficulty}%</Typography>
                <Slider
                  value={difficulty}
                  onChange={(e, newValue) => setDifficulty(newValue)}
                  aria-labelledby="difficulty-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={100}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isLoading || (!topic && !file)}
                  onClick={handleGenerateFlashcards}
                >
                  {isLoading ? 'Generating...' : 'Generate Flashcards'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
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
                  detail={card.detail}
                  strength={card.strength}
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