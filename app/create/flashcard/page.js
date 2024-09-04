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
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let content = topic;
      if (file) {
        content = await readFileContent(file);
      }
      const generatedFlashcards = await fetchQuestions(content, cardCount, difficulty);
      setFlashcards(generatedFlashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      if (error.message.includes('Resource has been exhausted')) {
        alert('We\'re experiencing high demand. Please try again in a few minutes.');
      } else {
        alert(`Error generating flashcards: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const fetchQuestions = async (content, count, difficulty) => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch('/api/generate/flashcard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: content, count, difficulty }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 429) {
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new Error(errorData.error || 'Failed to generate flashcards');
        }

        const data = await response.json();
        return data.flashcards;
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
      }
    }
    throw new Error('Max retries reached. Failed to generate flashcards.');
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
                  disabled={loading || (!topic && !file)}
                  onClick={handleSubmit}
                >
                  {loading ? 'Generating...' : 'Generate Flashcards'}
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