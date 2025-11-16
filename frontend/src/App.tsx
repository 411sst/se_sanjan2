import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages
import Home from './pages/Home';
import MerchantLogin from './pages/merchant/Login';
import MerchantRegister from './pages/merchant/Register';
import MerchantDashboard from './pages/merchant/Dashboard';
import CustomerLogin from './pages/customer/Login';
import BrowseCoupons from './pages/customer/BrowseCoupons';
import CustomerWallet from './pages/customer/Wallet';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/customer/coupons" element={<BrowseCoupons />} />

          {/* Merchant Routes */}
          <Route path="/merchant/login" element={<MerchantLogin />} />
          <Route path="/merchant/register" element={<MerchantRegister />} />
          <Route
            path="/merchant/dashboard"
            element={
              <ProtectedRoute requireRole="merchant">
                <MerchantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route
            path="/customer/wallet"
            element={
              <ProtectedRoute requireRole="customer">
                <CustomerWallet />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
