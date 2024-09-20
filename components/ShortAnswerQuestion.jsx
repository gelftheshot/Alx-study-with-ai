'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ShortAnswerQuestion = ({ question, correctAnswer = '', showAnswer, setShowAnswer, userAnswer }) => {
  const [localUserAnswer, setLocalUserAnswer] = useState(userAnswer || '');
  const [localSubmitted, setLocalSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isControlled = showAnswer !== undefined && setShowAnswer !== undefined;
  const currentSubmitted = isControlled ? showAnswer : localSubmitted;
  const setCurrentSubmitted = isControlled ? setShowAnswer : setLocalSubmitted;

  const handleSubmit = () => {
    setCurrentSubmitted(true);
    const normalizedUserAnswer = localUserAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
    setIsCorrect(normalizedUserAnswer === normalizedCorrectAnswer);
  };

  useEffect(() => {
    setLocalUserAnswer(userAnswer || '');
  }, [userAnswer]);

  useEffect(() => {
    if (currentSubmitted) {
      const normalizedUserAnswer = localUserAnswer.trim().toLowerCase();
      const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
      setIsCorrect(normalizedUserAnswer === normalizedCorrectAnswer);
    }
  }, [currentSubmitted, localUserAnswer, correctAnswer]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
        {question}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={localUserAnswer}
        onChange={(e) => setLocalUserAnswer(e.target.value)}
        disabled={currentSubmitted}
        sx={{ mb: 2 }}
      />
      <AnimatePresence>
        {currentSubmitted && (
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
