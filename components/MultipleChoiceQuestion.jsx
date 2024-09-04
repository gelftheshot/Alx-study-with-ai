'use client';
import { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MultipleChoiceQuestion = ({ question, options, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === correctAnswer);
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    correct: { backgroundColor: '#4caf50', color: '#ffffff' },
    incorrect: { backgroundColor: '#f44336', color: '#ffffff' },
  };

  const incorrectAnimation = {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {question}
      </Typography>
      <Grid container spacing={2}>
        {options.map((option, index) => (
          <Grid item xs={6} key={index}>
            <motion.div
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              animate={
                selectedAnswer === option
                  ? isCorrect
                    ? 'correct'
                    : 'incorrect'
                  : 'initial'
              }
              {...(selectedAnswer === option && !isCorrect ? incorrectAnimation : {})}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleAnswerClick(option)}
                disabled={selectedAnswer !== null && isCorrect}
                sx={{ justifyContent: 'flex-start', py: 1 }}
              >
                <Typography>
                  {String.fromCharCode(65 + index)}. {option}
                </Typography>
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <AnimatePresence>
        {selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{ mt: 2, textAlign: 'center', color: isCorrect ? 'green' : 'red' }}
            >
              {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
            </Typography>
            {!isCorrect && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="contained" onClick={handleTryAgain}>
                  Try Again
                </Button>
              </Box>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MultipleChoiceQuestion;
