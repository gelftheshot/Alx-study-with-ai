'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function HomeSignedIn() {
  const { user } = useUser();
  const [recentSets, setRecentSets] = useState([]);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    if (user) {
      fetchRecentSets();
      fetchTotalCards();
    }
  }, [user, fetchRecentSets, fetchTotalCards]);

  const fetchRecentSets = async () => {
    const flashcardsRef = collection(db, 'users', user.id, 'flashcards');
    const q = query(flashcardsRef, orderBy('createdAt', 'desc'), limit(3));
    const querySnapshot = await getDocs(q);
    const sets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecentSets(sets);
  };

  const fetchTotalCards = async () => {
    const flashcardsRef = collection(db, 'users', user.id, 'flashcards');
    const querySnapshot = await getDocs(flashcardsRef);
    let total = 0;
    querySnapshot.forEach(doc => {
      total += doc.data().cards.length;
    });
    setTotalCards(total);
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Welcome back, {user.firstName}!
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>Quick Stats</Typography>
              <Typography variant="body1">Total Flashcards: {totalCards}</Typography>
              <Typography variant="body1">Sets Created: {recentSets.length}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" component={Link} href="/progress" startIcon={<TrendingUpIcon />}>
                  View Progress
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>Recent Sets</Typography>
              {recentSets.map((set, index) => (
                <Typography key={set.id} variant="body1">{index + 1}. {set.topic}</Typography>
              ))}
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" component={Link} href="/my-flashcards" startIcon={<ViewListIcon />}>
                  View All Sets
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h5" gutterBottom>Create New Flashcards</Typography>
              <Typography variant="body1">Start a new set of flashcards on any topic.</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="secondary" component={Link} href="/create" startIcon={<AddIcon />}>
                  Create New Set
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}