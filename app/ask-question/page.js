'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Avatar, IconButton } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '../../components/ThemeProvider';
import { keyframes } from '@mui/system';

const dotAnimation = keyframes`
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
`;

const AnimatedDots = () => (
  <Typography
    component="span"
    sx={{
      '&::after': {
        content: "''",
        animation: `${dotAnimation} 1s infinite`,
        display: 'inline-block',
        width: '1em',
        textAlign: 'left',
      },
    }}
  />
);

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const messagesEndRef = useRef(null);
  const { darkMode } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Scroll to bottom immediately after adding user message
    scrollToBottom();

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMessage]);
      
      // Scroll to bottom after adding AI response
      scrollToBottom();
    } catch (error) {
      console.error('Error asking AI:', error);
      setMessages(prev => [...prev, { role: 'error', content: 'Sorry, I encountered an error. Please try again.' }]);
      
      // Scroll to bottom after adding error message
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      mx: { xs: 2, sm: 4, md: 6, lg: 8 }, // Add horizontal margin
      my: 2 // Add a small vertical margin
    }}>
      <Paper elevation={3} sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        borderRadius: '12px'
      }}>
        <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                {message.role !== 'user' && (
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%', 
                    bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: message.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                  }}
                >
                  <Typography>{message.content}</Typography>
                </Paper>
                {message.role === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            </ListItem>
          ))}
          {isLoading && (
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper',
                    borderRadius: '20px 20px 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography>
                    Thinking<AnimatedDots />
                  </Typography>
                </Paper>
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{ mr: 1 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            endIcon={<SendIcon />}
            disabled={isLoading || !input.trim()}
            sx={{ height: 56, width: 100 }}
          >
            {isLoading ? 'Sending' : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AskAI;