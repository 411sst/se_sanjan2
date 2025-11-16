import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Phone, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(0); // 0: Enter identifier, 1: Enter OTP
  const [loginType, setLoginType] = useState<'email' | 'phone'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLoginTypeChange = (_: React.MouseEvent<HTMLElement>, newType: 'email' | 'phone' | null) => {
    if (newType !== null) {
      setLoginType(newType);
      setIdentifier('');
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error(`Please enter your ${loginType}`);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestOTP({
        identifier: identifier.trim(),
        type: loginType,
      });

      if (response.success) {
        toast.success(response.message || 'OTP sent successfully!');
        setOtpSent(true);
        setStep(1);
      }
    } catch (error: any) {
      console.error('OTP request error:', error);
      // Error already handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOTP({
        identifier: identifier.trim(),
        otpCode: otp.trim(),
        purpose: 'login',
      });

      if (response.success && response.data) {
        toast.success('Login successful!');
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token,
        }));
        navigate('/customer/coupons');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setOtp('');
      // Error already handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setLoading(true);
    try {
      const response = await authService.requestOTP({
        identifier: identifier.trim(),
        type: loginType,
      });

      if (response.success) {
        toast.success('OTP resent successfully!');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(0);
    setOtp('');
    setOtpSent(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
              Customer Login
            </Typography>

            <Stepper activeStep={step} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Enter {loginType === 'phone' ? 'Phone' : 'Email'}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Verify OTP</StepLabel>
              </Step>
            </Stepper>

            {step === 0 ? (
              <Box component="form" onSubmit={handleRequestOTP}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Login or create an account using OTP verification
                </Typography>

                <ToggleButtonGroup
                  value={loginType}
                  exclusive
                  onChange={handleLoginTypeChange}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <ToggleButton value="phone">
                    <Phone sx={{ mr: 1 }} />
                    Phone
                  </ToggleButton>
                  <ToggleButton value="email">
                    <Email sx={{ mr: 1 }} />
                    Email
                  </ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  fullWidth
                  label={loginType === 'phone' ? 'Phone Number' : 'Email Address'}
                  type={loginType === 'phone' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={loginType === 'phone' ? '+91 98765 43210' : 'you@example.com'}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Are you a merchant?{' '}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate('/merchant/login')}
                    >
                      Login here
                    </Button>
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleVerifyOTP}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  We've sent a 6-digit code to <strong>{identifier}</strong>
                </Typography>

                <TextField
                  fullWidth
                  label="Enter OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  placeholder="000000"
                  required
                  disabled={loading}
                  inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]{6}',
                    style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify & Login'}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Change {loginType}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CustomerLogin;
