import React from 'react';
import { Container, Typography, Box, TextField, Button, Card, CardContent } from '@mui/material';

const MerchantLogin: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Merchant Login
            </Typography>
            <Box component="form" sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
              >
                Sign In
              </Button>
              <Button fullWidth variant="text">
                Don't have an account? Register
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MerchantLogin;
