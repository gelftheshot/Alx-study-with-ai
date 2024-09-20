'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import SendIcon from '@mui/icons-material/Send';

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error asking AI:', error);
      setMessages(prev => [...prev, { role: 'error', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', p: 4 }}>
      <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px' }}>
        <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  maxWidth: '70%', 
                  bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: message.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                  mb: 1
                }}
              >
                <ListItemText primary={message.content} />
              </Paper>
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
            disabled={isLoading}
            sx={{ height: 56, width: 100 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AskAI;