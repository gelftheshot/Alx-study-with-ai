'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Here you can make an API call to your backend to confirm the payment
    // and update the user's subscription status
  }, [sessionId]);

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Payment Successful
        </Typography>
        <Typography variant="body1" align="center">
          Thank you for your subscription. Your session ID is: {sessionId}
        </Typography>
      </Container>
    </Box>
  );
}
