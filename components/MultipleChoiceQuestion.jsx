'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MultipleChoiceQuestion = ({ question, options, correctAnswer, selectedOption, setSelectedOption }) => {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const isControlled = selectedOption !== undefined && setSelectedOption !== undefined;
  const currentSelectedAnswer = isControlled ? selectedOption : localSelectedAnswer;
  const setCurrentSelectedAnswer = isControlled ? setSelectedOption : setLocalSelectedAnswer;

  useEffect(() => {
    if (currentSelectedAnswer) {
      const selectedIndex = currentSelectedAnswer.charCodeAt(0) - 65;
      setIsCorrect(options[selectedIndex] === correctAnswer);
    }
  }, [currentSelectedAnswer, options, correctAnswer]);

  const handleAnswerClick = (answer, index) => {
    const selectedLetter = String.fromCharCode(65 + index);
    setCurrentSelectedAnswer(selectedLetter);
  };

  const handleTryAgain = () => {
    setCurrentSelectedAnswer(null);
    setIsCorrect(null);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
  };

  return (
    <Paper elevation={3} sx={{ p: 1, mb: 2, borderRadius: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
        {question}
      </Typography>
      <Grid container spacing={2}>
        {options.map((option, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleAnswerClick(option, index)}
                disabled={currentSelectedAnswer !== null && !isControlled}
                data-option-index={index}
                sx={{
                  justifyContent: 'flex-start',
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 'normal',
                  bgcolor: currentSelectedAnswer === String.fromCharCode(65 + index)
                    ? isCorrect
                      ? '#4caf50'
                      : '#f44336'
                    : 'inherit',
                  color: currentSelectedAnswer === String.fromCharCode(65 + index) ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: currentSelectedAnswer === String.fromCharCode(65 + index)
                      ? isCorrect
                        ? '#45a049'
                        : '#d32f2f'
                      : 'inherit',
                  },
                }}
              >
                <Typography variant="body2">
                  {String.fromCharCode(65 + index)}. {option}
                </Typography>
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <AnimatePresence>
        {currentSelectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: isCorrect ? 'green' : 'red' }}
              >
                {isCorrect ? 'Correct!' : 'Incorrect.'}
              </Typography>
              {!isCorrect && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleTryAgain}
                  sx={{ mt: 0.5 }}
                >
                  Try Again
                </Button>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

export default MultipleChoiceQuestion;
