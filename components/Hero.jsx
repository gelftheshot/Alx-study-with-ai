'use client';
import { useState, useEffect, useMemo } from 'react';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Flashcard from './flashcardExample';
import MultipleChoiceQuestion from './MultipleChoiceExample';
import ShortAnswerQuestion from './ShortAnswerExample';

const flashcardExamples = [
  {
    question: "What's the capital of France?",
    answer: "Paris",
    detail: "Paris is the capital and most populous city of France.",
    strength: 85
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    answer: "Harper Lee",
    detail: "Harper Lee was an American novelist best known for this Pulitzer Prize-winning novel.",
    strength: 70
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "Pacific Ocean",
    detail: "The Pacific Ocean covers an area of about 63 million square miles.",
    strength: 90
  },
  {
    question: "In what year did World War II end?",
    answer: "1945",
    detail: "World War II ended with the surrender of Japan in August 1945.",
    strength: 80
  }
];

const multipleChoiceExamples = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Cu"],
    correctAnswer: "Au"
  },
  {
    question: "Which of these is not a type of renewable energy?",
    options: ["Solar", "Wind", "Nuclear", "Hydroelectric"],
    correctAnswer: "Nuclear"
  },
  {
    question: "Who painted 'The Starry Night'?",
    options: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Leonardo da Vinci"],
    correctAnswer: "Vincent van Gogh"
  }
];

const shortAnswerExamples = [
  {
    question: "What is the largest organ in the human body?",
    answer: "Skin"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare"
  },
  {
    question: "What is the capital of Japan?",
    answer: "Tokyo"
  },
  {
    question: "What is the chemical symbol for oxygen?",
    answer: "O"
  }
];

export default function Hero() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showShortAnswer, setShowShortAnswer] = useState(false);
  const [shortAnswerText, setShortAnswerText] = useState('');

  const questionSequence = useMemo(() => [
    { type: 'multipleChoice', data: multipleChoiceExamples },
    { type: 'flashcard', data: flashcardExamples },
    { type: 'shortAnswer', data: shortAnswerExamples },
    { type: 'multipleChoice', data: multipleChoiceExamples },
    { type: 'flashcard', data: flashcardExamples },
  ], []);

  useEffect(() => {
    const questionInterval = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questionSequence.length);
      resetQuestionState();
    }, 8000);

    return () => clearInterval(questionInterval);
  }, [questionSequence.length]);

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsFlashcardFlipped(false);
    setShowShortAnswer(false);
    setShortAnswerText('');
  };

  useEffect(() => {
    resetQuestionState();
    const currentQuestion = questionSequence[currentQuestionIndex];

    const timer = setTimeout(() => {
      if (currentQuestion.type === 'multipleChoice') {
        const correctAnswer = currentQuestion.data[currentQuestionIndex % currentQuestion.data.length].correctAnswer;
        const correctIndex = currentQuestion.data[currentQuestionIndex % currentQuestion.data.length].options.indexOf(correctAnswer);
        setSelectedOption(String.fromCharCode(65 + correctIndex));
      } else if (currentQuestion.type === 'flashcard') {
        setIsFlashcardFlipped(true);
      } else if (currentQuestion.type === 'shortAnswer') {
        typeAnswer(currentQuestion.data[currentQuestionIndex % currentQuestion.data.length].answer);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questionSequence]);

  const typeAnswer = (answer) => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < answer.length) {
        setShortAnswerText(prev => prev + answer[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowShortAnswer(true), 1000);
      }
    }, 100);
  };

  const renderCurrentQuestion = () => {
    const currentQuestion = questionSequence[currentQuestionIndex];
    const dataIndex = currentQuestionIndex % currentQuestion.data.length;
    const key = `${currentQuestion.type}-${dataIndex}-${currentQuestionIndex}`;

    switch (currentQuestion.type) {
      case 'multipleChoice':
        return (
          <MultipleChoiceQuestion
            key={key}
            question={currentQuestion.data[dataIndex].question}
            options={currentQuestion.data[dataIndex].options}
            correctAnswer={currentQuestion.data[dataIndex].correctAnswer}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        );
      case 'flashcard':
        return (
          <Flashcard
            key={key}
            question={currentQuestion.data[dataIndex].question}
            answer={currentQuestion.data[dataIndex].answer}
            detail={currentQuestion.data[dataIndex].detail}
            strength={currentQuestion.data[dataIndex].strength}
            isFlipped={isFlashcardFlipped}
            setIsFlipped={setIsFlashcardFlipped}
          />
        );
      case 'shortAnswer':
        return (
          <ShortAnswerQuestion
            key={key}
            question={currentQuestion.data[dataIndex].question}
            correctAnswer={currentQuestion.data[dataIndex].answer}
            showAnswer={showShortAnswer}
            setShowAnswer={setShowShortAnswer}
            userAnswer={shortAnswerText}
          />
        );
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography component="h1" variant="h2" color="text.primary" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              ALX Study with AI
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Revolutionize your learning with AI-powered study tools. Create flashcards, quizzes, notes, and more to master any subject effortlessly.
            </Typography>
            <Box sx={{ mt: 6 }}>
              <SignedOut>
                <Button variant="contained" color="secondary" component={Link} href="/sign-up" size="large" sx={{ mr: 2, px: 4, py: 1.5 }}>
                  Get Started
                </Button>
                <Button variant="outlined" color="primary" component={Link} href="/sign-in" size="large" sx={{ px: 4, py: 1.5 }}>
                  Log In
                </Button>
              </SignedOut>
              <SignedIn>
                <Button variant="contained" color="secondary" component={Link} href="/study-tools" size="large" sx={{ px: 4, py: 1.5 }}>
                  Start Studying
                </Button>
              </SignedIn>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {renderCurrentQuestion()}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}