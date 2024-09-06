'use client';
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, TextField } from '@mui/material';
import ShortAnswerQuestion from '../../../components/ShortAnswerQuestion';
import TopicOrFileInput from '../../../components/TopicOrFileInput';
import Slider from '@mui/material/Slider';

export default function ShortAnswerPage() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState(50);

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
    setFile(null);
  };

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setTopic('');
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('count', questionCount.toString());
        formData.append('difficulty', difficulty.toString());

        const uploadResponse = await fetch('/api/processPdf', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to process PDF');
        }

        const { text } = await uploadResponse.json();

        response = await fetch('/api/generatefrompdf/shortAnswer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, count: questionCount, difficulty }),
        });
      } else {
        response = await fetch('/api/generate/shortAnswer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: topic, count: questionCount, difficulty }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(`Failed to generate questions: ${err.message}`);
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
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={9}>
              <TopicOrFileInput onTopicChange={handleTopicChange} onFileUpload={handleFileUpload} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  fullWidth
                  label="Number of Questions"
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
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
                  variant="contained"
                  onClick={handleGenerateQuestions}
                  disabled={isLoading || (!topic && !file)}
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Generate Questions
                </Button>
              </Box>
            </Grid>
          </Grid>
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
