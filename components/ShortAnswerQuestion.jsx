'use client';
import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ShortAnswerQuestion = ({ question, correctAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
    const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    setIsCorrect(isAnswerCorrect);
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
        {question}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={submitted}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {!submitted ? (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleTryAgain}>
              Try Again
            </Button>
          )}
        </motion.div>
      </Box>
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: isCorrect ? 'success.light' : 'error.light',
                color: 'common.white',
              }}
            >
              {isCorrect
                ? 'Correct! Well done.'
                : `Incorrect. The correct answer is: ${correctAnswer}`}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

export default ShortAnswerQuestion;
