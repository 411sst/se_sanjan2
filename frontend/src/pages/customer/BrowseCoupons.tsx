import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import couponService, { Coupon } from '../../services/couponService';

const BrowseCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async (search?: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await couponService.browseCoupons({ search, limit: 50 });
      setCoupons(response.coupons || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load coupons');
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCoupons(searchTerm);
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `$${coupon.discount_value} OFF`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Browse Coupons
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Search coupons"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : coupons.length === 0 ? (
        <Alert severity="info">
          No coupons available at the moment. Check back soon!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {coupons.map((coupon) => (
            <Grid item xs={12} sm={6} md={4} key={coupon.id}>
              <Card>
                {coupon.image_url && (
                  <Box
                    component="img"
                    src={coupon.image_url}
                    alt={coupon.title}
                    sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {coupon.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {coupon.description}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Chip
                      label={getDiscountText(coupon)}
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                    {coupon.category && (
                      <Chip
                        label={coupon.category}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Code: <strong>{coupon.code}</strong>
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Valid until: {new Date(coupon.end_date).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" fullWidth>
                    Claim Coupon
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BrowseCoupons;
