import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Couponify
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/customer/coupons')}>
            Browse Coupons
          </Button>
          <Button color="inherit" onClick={() => navigate('/customer/login')}>
            Customer Login
          </Button>
          <Button color="inherit" onClick={() => navigate('/merchant/login')}>
            Merchant Portal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
