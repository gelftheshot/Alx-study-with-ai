'use client';
import { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MultipleChoiceQuestion = ({ question, options = [], correctAnswer }) => {
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
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
  };

  return (
    <Paper elevation={3} sx={{ p: 1, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {question}
        </Typography>
        <Grid container spacing={1}>
          {options.map((option, index) => (
            <Grid item xs={6} key={index}>
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAnswerClick(option)}
                  disabled={selectedAnswer !== null}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 0.5,
                    textTransform: 'none',
                    fontWeight: 'normal',
                    bgcolor: selectedAnswer === option
                      ? isCorrect
                        ? '#4caf50'
                        : '#f44336'
                      : 'inherit',
                    color: selectedAnswer === option ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: selectedAnswer === option
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
      </Box>
      <AnimatePresence>
        {selectedAnswer && (
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
