'use client';
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&family=Playfair+Display&family=Montserrat&family=Lora&display=swap" rel="stylesheet"></link>
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
