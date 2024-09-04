'use client';
import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';
import ShortAnswerQuestion from '../../../components/ShortAnswerQuestion';

export default function ShortAnswerPage() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async (topic, count) => {
    const response = await fetch('/api/generate/shortAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: topic, count }),
    });
    const rawData = await response.text();
    console.log('Raw API response:', rawData);
    
    try {
      const data = JSON.parse(rawData);
      if (data.error) {
        throw new Error(data.error);
      }
      return data.questions;
    } catch (err) {
      throw new Error(`Failed to parse API response: ${err.message}`);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedQuestions = await fetchQuestions(topic, 5); // Generate 5 questions
      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6, mx: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Short Answer Questions
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
          <TextField
            fullWidth
            label="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateQuestions}
            disabled={isLoading || !topic}
            fullWidth
            size="large"
          >
            Generate Questions
          </Button>
        </Paper>
        {error && (
          <Typography color="error" sx={{ mb: 3 }}>
            Error: {error}
          </Typography>
        )}
        {isLoading ? (
          <Typography>Generating questions...</Typography>
        ) : (
          <Grid container spacing={4}>
            {questions.map((q, index) => (
              <Grid item xs={12} key={index}>
                <ShortAnswerQuestion
                  question={q.question}
                  correctAnswer={q.answer}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
