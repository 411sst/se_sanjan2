import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { toast } from 'react-toastify';
import couponService, { Coupon } from '../../services/couponService';
import CouponCard from '../../components/CouponCard';
import { useAppSelector } from '../../store/hooks';

const BrowseCoupons: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCoupons();
  }, [categoryFilter]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (categoryFilter) {
        filters.category = categoryFilter;
      }

      const response = await couponService.getAllCoupons(filters);
      if (response.success && response.data) {
        setCoupons(response.data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(response.data.map((c: Coupon) => c.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      // Error already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCoupon = async (couponId: number) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      toast.info('Please login as a customer to claim coupons');
      return;
    }

    try {
      const response = await couponService.claimCoupon(couponId);
      if (response.success) {
        toast.success('Coupon claimed successfully!');
        fetchCoupons(); // Refresh the list
      }
    } catch (error) {
      console.error('Error claiming coupon:', error);
      // Error already handled by interceptor
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      !searchQuery ||
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Browse Coupons
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover amazing deals and save money
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search coupons by title, code, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                disabled={!searchQuery && !categoryFilter}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {/* Active Filters */}
          {(searchQuery || categoryFilter) && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, my: 'auto' }}>
                Active Filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => setSearchQuery('')}
                  size="small"
                />
              )}
              {categoryFilter && (
                <Chip
                  label={`Category: ${categoryFilter}`}
                  onDelete={() => setCategoryFilter('')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* No Results */}
        {!loading && filteredCoupons.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No coupons found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or check back later
            </Typography>
          </Box>
        )}

        {/* Coupons Grid */}
        {!loading && filteredCoupons.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {filteredCoupons.length} {filteredCoupons.length === 1 ? 'coupon' : 'coupons'}
            </Typography>
            <Grid container spacing={3}>
              {filteredCoupons.map((coupon) => (
                <Grid item xs={12} sm={6} md={4} key={coupon.id}>
                  <CouponCard
                    coupon={coupon}
                    onClaim={handleClaimCoupon}
                    showActions={isAuthenticated && user?.role === 'customer'}
                    actionLabel="Claim to Wallet"
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};

export default BrowseCoupons;
