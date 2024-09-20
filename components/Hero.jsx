'use client';
import { useState, useEffect, useMemo } from 'react';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Flashcard from './flashcard';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';

const flashcardExamples = [
  {
    question: "What's the capital of France?",
    answer: "Paris",
    detail: "Paris is the capital and most populous city of France."
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    detail: "William Shakespeare was an English playwright, poet, and actor."
  },
  {
    question: "What's the largest planet in our solar system?",
    answer: "Jupiter",
    detail: "Jupiter is the fifth planet from the Sun and the largest in the Solar System."
  },
  {
    question: "What is the chemical symbol for water?",
    answer: "H2O",
    detail: "H2O represents two hydrogen atoms and one oxygen atom."
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    detail: "Leonardo da Vinci was an Italian polymath of the Renaissance period."
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
    question: "Which of these is not a primary color?",
    options: ["Red", "Blue", "Green", "Yellow"],
    correctAnswer: "Green"
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Brain", "Liver", "Skin", "Heart"],
    correctAnswer: "Skin"
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctAnswer: "Australia"
  }
];

const shortAnswerExamples = [
  {
    question: "What is the largest organ in the human body?",
    answer: "Skin"
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci"
  },
  {
    question: "What is the capital of Japan?",
    answer: "Tokyo"
  },
  {
    question: "What is the chemical symbol for oxygen?",
    answer: "O"
  },
  {
    question: "In which year did World War II end?",
    answer: "1945"
  }
];

export default function Hero() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionTypeIndex, setCurrentQuestionTypeIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showShortAnswer, setShowShortAnswer] = useState(false);
  const [shortAnswerText, setShortAnswerText] = useState('');

  const questionSequence = useMemo(() => [
    { type: 'multipleChoice', data: multipleChoiceExamples },
    { type: 'flashcard', data: flashcardExamples },
    { type: 'shortAnswer', data: shortAnswerExamples },
  ], []);

  useEffect(() => {
    const questionInterval = setInterval(() => {
      setCurrentQuestionTypeIndex((prevType) => (prevType + 1) % questionSequence.length);
      setCurrentQuestionIndex(0);
      resetQuestionState();
    }, 5000);

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
    const currentQuestion = questionSequence[currentQuestionTypeIndex];

    const timer = setTimeout(() => {
      if (currentQuestion.type === 'multipleChoice') {
        const correctAnswer = currentQuestion.data[currentQuestionIndex].correctAnswer;
        const correctIndex = currentQuestion.data[currentQuestionIndex].options.indexOf(correctAnswer);
        setSelectedOption(String.fromCharCode(65 + correctIndex));
      } else if (currentQuestion.type === 'flashcard') {
        setIsFlashcardFlipped(true);
      } else if (currentQuestion.type === 'shortAnswer') {
        typeAnswer(currentQuestion.data[currentQuestionIndex].answer);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentQuestionIndex, currentQuestionTypeIndex, questionSequence]);

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
    const currentQuestion = questionSequence[currentQuestionTypeIndex];
    const key = `${currentQuestion.type}-${currentQuestionIndex}-${currentQuestionTypeIndex}`;

    switch (currentQuestion.type) {
      case 'multipleChoice':
        return (
          <MultipleChoiceQuestion
            key={key}
            question={currentQuestion.data[currentQuestionIndex].question}
            options={currentQuestion.data[currentQuestionIndex].options}
            correctAnswer={currentQuestion.data[currentQuestionIndex].correctAnswer}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        );
      case 'flashcard':
        return (
          <Flashcard
            key={key}
            question={currentQuestion.data[currentQuestionIndex].question}
            answer={currentQuestion.data[currentQuestionIndex].answer}
            detail={currentQuestion.data[currentQuestionIndex].detail}
            isFlipped={isFlashcardFlipped}
            setIsFlipped={setIsFlashcardFlipped}
          />
        );
      case 'shortAnswer':
        return (
          <ShortAnswerQuestion
            key={key}
            question={currentQuestion.data[currentQuestionIndex].question}
            correctAnswer={currentQuestion.data[currentQuestionIndex].answer}
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