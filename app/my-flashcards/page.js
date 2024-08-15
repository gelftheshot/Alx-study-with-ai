'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

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
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        My Flashcards
      </Typography>
      {selectedSet ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            {selectedSet.topic}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Front</TableCell>
                  <TableCell>Back</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSet.cards.map((card, index) => (
                  <TableRow key={index}>
                    <TableCell>{card.front}</TableCell>
                    <TableCell>{card.back}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={() => setSelectedSet(null)}
            >
              Back to list
            </Typography>
          </Box>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Topic</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Cards</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flashcardSets.map((set) => (
                <TableRow
                  key={set.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' } }}
                  onClick={() => setSelectedSet(set)}
                >
                  <TableCell>{set.topic}</TableCell>
                  <TableCell>{new Date(set.createdAt.seconds * 1000).toLocaleString()}</TableCell>
                  <TableCell>{set.cards.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyFlashcards;