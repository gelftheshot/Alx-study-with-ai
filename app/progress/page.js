'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Container, Typography, Grid, Paper, Box, CircularProgress, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Progress = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [stats, setStats] = useState({
    totalFlashcards: 0,
    totalSets: 0,
    averageCardsPerSet: 0,
    studyStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserStats();
    }
  }, [isSignedIn, user]);

  const fetchUserStats = async () => {
    try {
      const flashcardsRef = collection(db, 'users', user.id, 'flashcards');
      const querySnapshot = await getDocs(flashcardsRef);
      
      let totalCards = 0;
      let totalSets = querySnapshot.size;
      
      querySnapshot.forEach((doc) => {
        const setData = doc.data();
        totalCards += setData.cards.length;
      });

      setStats({
        totalFlashcards: totalCards,
        totalSets: totalSets,
        averageCardsPerSet: totalSets > 0 ? Math.round(totalCards / totalSets) : 0,
        studyStreak: 7, // This is a mock value, you'd need to implement actual streak tracking
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockChartData = [
    { name: 'Mon', cards: 12 },
    { name: 'Tue', cards: 19 },
    { name: 'Wed', cards: 3 },
    { name: 'Thu', cards: 5 },
    { name: 'Fri', cards: 2 },
    { name: 'Sat', cards: 15 },
    { name: 'Sun', cards: 8 },
  ];

  if (!isLoaded || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Please sign in to view your progress</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Your Progress</Typography>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Flashcards
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalFlashcards}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Sets
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalSets}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Avg. Cards per Set
            </Typography>
            <Typography component="p" variant="h4">
              {stats.averageCardsPerSet}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Study Streak
            </Typography>
            <Typography component="p" variant="h4">
              {stats.studyStreak} days
            </Typography>
          </Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Cards Studied This Week
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cards" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Progress Bar */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Weekly Goal Progress
            </Typography>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={70} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${70}%`}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Progress;
