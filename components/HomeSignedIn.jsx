'use client';
import { useUser } from '@clerk/nextjs';
import { Box, Container, Typography, Grid, Paper, Button, Avatar } from '@mui/material';
import Link from 'next/link';
import QuizIcon from '@mui/icons-material/Quiz';
import ShortTextIcon from '@mui/icons-material/ShortText';
import StyleIcon from '@mui/icons-material/Style';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';

const options = [
  { title: 'Flashcards', subtitle: 'Create and study flashcards', icon: StyleIcon, href: '/create/flashcard', color: '#FFC107', action: 'Create Flashcards' },
  { title: 'Multiple Choice', subtitle: 'Generate quiz questions', icon: QuizIcon, href: '/create/MultipleChoice', color: '#4CAF50', action: 'Create Quiz' },
  { title: 'Short Answer', subtitle: 'Practice short answers', icon: ShortTextIcon, href: '/create/shortAnswer', color: '#2196F3', action: 'Generate Questions' },
  { title: 'Study Notes', subtitle: 'Generate study notes', icon: MenuBookIcon, href: '/create/note', color: '#9C27B0', action: 'Create Notes' },
  { title: 'Ask AI', subtitle: 'Get answers to your questions', icon: HelpOutlineIcon, href: '/ask-question', color: '#FF5722', action: 'Ask a Question' },
  { title: 'Progress', subtitle: 'Track your learning', icon: TrendingUpIcon, href: '/progress', color: '#3F51B5', action: 'View Progress' },
  { title: 'Study Plan', subtitle: 'Create a study plan', icon: SchoolIcon, href: '/study-plan', color: '#607D8B', action: 'Create Plan' },
];

export default function HomeSignedIn() {
  const { user } = useUser();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ mb: 6, fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
          Welcome to ALX Study with AI, {user.firstName}!
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 6, textAlign: 'center', color: 'text.secondary' }}>
          Choose a study tool to get started:
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {options.map((option, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-10px)', 
                    boxShadow: 6,
                    '& .MuiAvatar-root': {
                      bgcolor: option.color,
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'action.hover', 
                    color: option.color,
                    mb: 2,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <option.icon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {option.subtitle}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  href={option.href}
                  sx={{ 
                    mt: 2, 
                    borderColor: option.color, 
                    color: option.color,
                    '&:hover': {
                      bgcolor: option.color,
                      color: 'white',
                    }
                  }}
                >
                  {option.action}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}