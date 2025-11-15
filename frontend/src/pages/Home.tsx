import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" gutterBottom>
          Welcome to Couponify
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your complete virtual coupon distribution platform
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/customer/coupons')}
          >
            Browse Coupons
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/merchant/login')}
          >
            Merchant Login
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                For Customers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover great deals, save money, and manage your coupons in one place
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                For Merchants
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create campaigns, track analytics, and grow your business with digital coupons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Secure & Fast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built with security in mind, featuring OTP verification and fraud prevention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
