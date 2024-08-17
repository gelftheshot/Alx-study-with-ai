'use client'
import { useState, useEffect } from 'react';
import Flashcard from './flashcard';

const AutoFlippingFlashcard = ({ flashcardData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000); // Flip every 3 seconds

    const changeCardInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % flashcardData.length);
    }, 6000); // Change card every 6 seconds

    return () => {
      clearInterval(flipInterval);
      clearInterval(changeCardInterval);
    };
  }, [flashcardData.length]);

  return (
    <Flashcard
      question={flashcardData[currentIndex].question}
      answer={flashcardData[currentIndex].answer}
      isFlipped={isFlipped}
      setIsFlipped={setIsFlipped}
    />
  );
};

export default AutoFlippingFlashcard;