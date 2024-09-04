'use client';
import { useUser } from '@clerk/nextjs';
import { Box, Container, Typography, Grid, Paper, Button, Avatar } from '@mui/material';
import Link from 'next/link';
import QuizIcon from '@mui/icons-material/Quiz';
import ShortTextIcon from '@mui/icons-material/ShortText';
import StyleIcon from '@mui/icons-material/Style';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ViewListIcon from '@mui/icons-material/ViewList';

const options = [
  { title: 'Multiple Choice', subtitle: 'Generate questions', icon: QuizIcon, href: '/generate-mcq', color: '#4CAF50' },
  { title: 'Short Answer', subtitle: 'Create brief questions', icon: ShortTextIcon, href: '/generate-short-answer', color: '#2196F3' },
  { title: 'Flashcards', subtitle: 'Build your deck', icon: StyleIcon, href: '/create', color: '#FFC107' },
  { title: 'Ask AI', subtitle: 'Query your files', icon: HelpOutlineIcon, href: '/ask-question', color: '#9C27B0' },
  { title: 'My Sets', subtitle: 'View flashcards', icon: ViewListIcon, href: '/my-flashcards', color: '#FF5722' },
  { title: 'Progress', subtitle: 'Track learning', icon: TrendingUpIcon, href: '/progress', color: '#3F51B5' },
  { title: 'More', subtitle: 'Explore options', icon: MoreHorizIcon, href: '/more-options', color: '#607D8B' },
];

export default function HomeSignedIn() {
  const { user } = useUser();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ mb: 6, fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
          Welcome back, {user.firstName}!
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 6, textAlign: 'center', color: 'text.secondary' }}>
          Ready to boost your learning? Choose an option below:
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {options.map((option, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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
                  Get Started
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}