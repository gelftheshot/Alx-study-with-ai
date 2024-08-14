'use client';
import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import getStripe from '../utils/get-stripejs';

const tiers = [
  {
    title: 'Free',
    price: '0',
    priceId: 'price_free', // You might not need this for the free tier
    description: ['10 flashcards per day', 'Basic AI conversion', 'Web access'],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '15',
    priceId: 'price_actual_id_from_stripe', // Replace with your actual Stripe Price ID
    description: [
      'Unlimited flashcards',
      'Advanced AI conversion',
      'Priority support',
      'Mobile app access',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '30',
    priceId: 'price_another_actual_id_from_stripe', // Replace with your actual Stripe Price ID
    description: [
      'Unlimited flashcards',
      'Custom AI models',
      'API access',
      'Dedicated support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState({});

  const handleSubscribe = async (priceId) => {
    setLoading((prev) => ({ ...prev, [priceId]: true }));
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const { sessionId } = await response.json();
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, [priceId]: false }));
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {tiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                    <Typography component="h2" variant="h3" color="text.primary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    onClick={() => handleSubscribe(tier.priceId)}
                    disabled={loading[tier.priceId]}
                  >
                    {loading[tier.priceId] ? 'Loading...' : tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}