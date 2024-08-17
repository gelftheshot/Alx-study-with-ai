'use client'
import { useState, useEffect } from 'react';
import Flashcard from './flashcard';

const AutoFlippingFlashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000); // Flip every 3 seconds

    return () => clearInterval(flipInterval);
  }, []);

  return (
    <Flashcard
      question={question}
      answer={answer}
      isFlipped={isFlipped}
      setIsFlipped={setIsFlipped}
    />
  );
};

export default AutoFlippingFlashcard;
