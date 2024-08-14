'use client';
import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function CanceledPage() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Payment Canceled
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Your payment was canceled. You have not been charged.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" component={Link} href="/pricing">
            Back to Pricing
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
