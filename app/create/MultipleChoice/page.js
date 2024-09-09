'use client';
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, TextField } from '@mui/material';
import MultipleChoiceQuestion from '../../../components/MultipleChoiceQuestion';
import TopicOrFileInput from '../../../components/TopicOrFileInput';
import Slider from '@mui/material/Slider';

export default function MultipleChoicePage() {
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
      let questionData;
      if (file) {
        // Process PDF and generate questions
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/processPdf', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to process PDF');
        }

        const { text } = await uploadResponse.json();

        const generateResponse = await fetch('/api/generatefrompdf/multiplechoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, count: questionCount, difficulty }),
        });

        if (!generateResponse.ok) {
          throw new Error('Failed to generate questions');
        }

        questionData = await generateResponse.json();
      } else {
        // Generate questions from topic
        const response = await fetch('/api/generate/multiplechoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: topic, count: questionCount, difficulty }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate questions');
        }

        questionData = await response.json();
      }

      setQuestions(questionData.questions);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to generate questions. Please try again later or with a different input.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6, mx: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Multiple Choice Questions
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
                <MultipleChoiceQuestion
                  question={q.question}
                  options={[q.A, q.B, q.C, q.D]}
                  correctAnswer={q.correctAnswer}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
