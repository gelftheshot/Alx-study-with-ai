'use client';
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import ShortAnswerQuestion from '../../../components/ShortAnswerQuestion';
import TopicOrFileInput from '../../../components/TopicOrFileInput';

export default function ShortAnswerPage() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      let content = topic;
      if (file) {
        content = await readFileContent(file);
      }
      const generatedQuestions = await fetchQuestions(content, 5);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = async (file) => {
    // Implement file reading logic here
    // For now, we'll just return a placeholder
    return "File content placeholder";
  };

  const fetchQuestions = async (content, count) => {
    // Implement your API call here
    // For now, we'll just return placeholder questions
    return [
      { question: "Sample question 1?", answer: "Sample answer 1" },
      { question: "Sample question 2?", answer: "Sample answer 2" },
    ];
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6, mx: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Short Answer Questions
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
          <TopicOrFileInput onTopicChange={handleTopicChange} onFileUpload={handleFileUpload} />
          <Button
            variant="contained"
            onClick={handleGenerateQuestions}
            disabled={isLoading || (!topic && !file)}
            fullWidth
            size="large"
            sx={{ mt: 3 }}
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
