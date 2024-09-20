'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Avatar, IconButton, Chip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useUser } from '@clerk/nextjs';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import PersonIcon from '@mui/icons-material/Person';

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    let dotsInterval;
    if (isLoading) {
      dotsInterval = setInterval(() => {
        setThinkingDots(dots => (dots.length < 3 ? dots + '.' : ''));
      }, 500);
    }
    return () => clearInterval(dotsInterval);
  }, [isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage, { role: 'thinking', content: 'Thinking', timestamp: new Date().toISOString() }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage = { role: 'ai', content: data.response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
      console.error('Error asking AI:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.message.includes('timed out')) {
        errorMessage = 'The request timed out. Please try again.';
      }
      setMessages(prev => [...prev.slice(0, -1), { role: 'error', content: errorMessage, timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = (index, reaction) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, reaction } : msg
    ));
  };

  const suggestedQuestions = [
    "What's the weather like today?",
    "Tell me a joke",
    "What's the latest news?",
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
        <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px', m: 2 }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <List sx={{ flexGrow: 1, overflow: 'auto', p: 2, height: 'calc(100vh - 200px)' }}>
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h5" gutterBottom>Welcome to AI Assistant!</Typography>
                <Typography variant="body1" gutterBottom>Ask me anything or try one of these:</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {suggestedQuestions.map((question, index) => (
                    <Chip
                      key={index}
                      label={question}
                      onClick={() => setInput(question)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1, maxWidth: '70%' }}>
                  {message.role !== 'user' && (
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                      <SmartToyIcon />
                    </Avatar>
                  )}
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: message.role === 'user' ? 'primary.main' : message.role === 'thinking' ? 'grey.300' : 'background.paper',
                      color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: message.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                    }}
                  >
                    <ListItemText 
                      primary={message.role === 'thinking' ? `${message.content}${thinkingDots}` : message.content}
                      secondary={new Date(message.timestamp).toLocaleTimeString()}
                    />
                  </Paper>
                  {message.role === 'user' && (
                    <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                      <PersonIcon />
                    </Avatar>
                  )}
                </Box>
              </ListItem>
            ))}
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
    </ThemeProvider>
  );
};

export default AskAI;