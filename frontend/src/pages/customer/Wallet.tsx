import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Wallet as WalletIcon, CheckCircle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import couponService, { ClaimedCoupon } from '../../services/couponService';
import CouponCard from '../../components/CouponCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wallet-tabpanel-${index}`}
      aria-labelledby={`wallet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerWallet: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [claimedCoupons, setClaimedCoupons] = useState<ClaimedCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const response = await couponService.getWallet();
      if (response.success && response.data) {
        setClaimedCoupons(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const activeCoupons = claimedCoupons.filter((cc) => cc.status === 'active');
  const redeemedCoupons = claimedCoupons.filter((cc) => cc.status === 'redeemed');
  const expiredCoupons = claimedCoupons.filter((cc) => cc.status === 'expired');

  const handleRedeemClick = (couponId: number) => {
    setSelectedCouponId(couponId);
    setRedeemDialogOpen(true);
    setOtpRequested(false);
    setOtp('');
    setTransactionAmount('');
  };

  const handleRequestOTP = async () => {
    if (!selectedCouponId) return;

    try {
      const response = await couponService.requestRedemptionOTP(selectedCouponId);
      if (response.success) {
        toast.success('OTP sent successfully!');
        setOtpRequested(true);
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!selectedCouponId || !otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setRedeeming(true);
    try {
      const response = await couponService.redeemCoupon(selectedCouponId, {
        otpCode: otp,
        transactionAmount: transactionAmount ? parseFloat(transactionAmount) : undefined,
      });

      if (response.success) {
        toast.success('Coupon redeemed successfully!');
        setRedeemDialogOpen(false);
        fetchWallet(); // Refresh wallet
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      setOtp('');
    } finally {
      setRedeeming(false);
    }
  };

  const handleCloseDialog = () => {
    setRedeemDialogOpen(false);
    setSelectedCouponId(null);
    setOtpRequested(false);
    setOtp('');
    setTransactionAmount('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WalletIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <div>
            <Typography variant="h3" fontWeight="bold">
              My Wallet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your claimed coupons
            </Typography>
          </div>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Active (${activeCoupons.length})`} />
            <Tab label={`Redeemed (${redeemedCoupons.length})`} />
            <Tab label={`Expired (${expiredCoupons.length})`} />
          </Tabs>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Active Coupons Tab */}
        <TabPanel value={tabValue} index={0}>
          {!loading && activeCoupons.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No active coupons
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Browse and claim coupons to see them here
              </Typography>
              <Button variant="contained" href="/customer/coupons">
                Browse Coupons
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {activeCoupons.map((claimedCoupon) => (
                <Grid item xs={12} sm={6} md={4} key={claimedCoupon.id}>
                  <CouponCard
                    coupon={claimedCoupon.coupon}
                    onRedeem={handleRedeemClick}
                    isClaimed={true}
                    showActions={true}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Redeemed Coupons Tab */}
        <TabPanel value={tabValue} index={1}>
          {!loading && redeemedCoupons.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No redeemed coupons yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coupons you redeem will appear here
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {redeemedCoupons.map((claimedCoupon) => (
                <Grid item xs={12} sm={6} md={4} key={claimedCoupon.id}>
                  <CouponCard
                    coupon={claimedCoupon.coupon}
                    isRedeemed={true}
                    showActions={false}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Expired Coupons Tab */}
        <TabPanel value={tabValue} index={2}>
          {!loading && expiredCoupons.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No expired coupons
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {expiredCoupons.map((claimedCoupon) => (
                <Grid item xs={12} sm={6} md={4} key={claimedCoupon.id}>
                  <CouponCard
                    coupon={claimedCoupon.coupon}
                    showActions={false}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Box>

      {/* Redeem Dialog */}
      <Dialog open={redeemDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Redeem Coupon</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {!otpRequested
              ? 'Click the button below to receive an OTP for coupon redemption.'
              : 'Enter the OTP sent to your registered contact and the transaction amount.'}
          </Typography>

          {otpRequested && (
            <>
              <TextField
                fullWidth
                label="Transaction Amount (Optional)"
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="Enter purchase amount"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: '₹',
                }}
              />
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                inputProps={{
                  maxLength: 6,
                  pattern: '[0-9]{6}',
                  style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {!otpRequested ? (
            <Button onClick={handleRequestOTP} variant="contained">
              Request OTP
            </Button>
          ) : (
            <Button
              onClick={handleRedeemCoupon}
              variant="contained"
              disabled={redeeming || otp.length !== 6}
            >
              {redeeming ? <CircularProgress size={24} /> : 'Redeem'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerWallet;
