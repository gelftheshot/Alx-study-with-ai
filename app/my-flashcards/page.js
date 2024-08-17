'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Flashcard from '../../components/flashcard';

const MyFlashcards = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchFlashcardSets();
    }
  }, [isSignedIn, user]);

  const fetchFlashcardSets = async () => {
    const flashcardsRef = collection(db, 'users', user.id, 'flashcards');
    const q = query(flashcardsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const sets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFlashcardSets(sets);
  };

  if (!isLoaded || !isSignedIn) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        My Flashcards
      </Typography>
      {selectedSet ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSelectedSet(null)}
              sx={{ mr: 2 }}
            >
              Back to list
            </Button>
            <Typography variant="h5">
              {selectedSet.topic}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {selectedSet.cards.map((card, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Flashcard question={card.front} answer={card.back} detail={card.detail} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedSet(null)}
            >
              Back to list
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {flashcardSets.map((set) => (
            <Grid item key={set.id} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
                onClick={() => setSelectedSet(set)}
              >
                <Typography variant="h6" gutterBottom>{set.topic}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(set.createdAt.seconds * 1000).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cards: {set.cards.length}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyFlashcards;