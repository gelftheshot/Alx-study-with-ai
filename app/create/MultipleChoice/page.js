'use client';
import { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import MultipleChoiceQuestion from '../../../components/MultipleChoiceQuestion';

export default function MultipleChoicePage() {
  const [questions, setQuestions] = useState([
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    // Add more questions as needed
  ]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Multiple Choice Questions
        </Typography>
        {questions.map((q, index) => (
          <MultipleChoiceQuestion
            key={index}
            question={q.question}
            options={q.options}
            correctAnswer={q.correctAnswer}
          />
        ))}
      </Box>
    </Container>
  );
}
