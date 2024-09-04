'use client';
import { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import ShortAnswerQuestion from '../../../components/ShortAnswerQuestion';

export default function ShortAnswerPage() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async (topic, count) => {
    const response = await fetch('/api/generate/shortanswer', {
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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Short Answer Questions
        </Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateQuestions}
            disabled={isLoading || !topic}
          >
            Generate Questions
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}
        {isLoading ? (
          <Typography>Generating questions...</Typography>
        ) : (
          questions.map((q, index) => (
            <ShortAnswerQuestion
              key={index}
              question={q.question}
              correctAnswer={q.answer}
            />
          ))
        )}
      </Box>
    </Container>
  );
}
