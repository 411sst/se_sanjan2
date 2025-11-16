import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  LocalOffer,
  People,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import couponService, { Coupon, CreateCouponRequest } from '../../services/couponService';
import { format } from 'date-fns';

const couponValidationSchema = Yup.object({
  code: Yup.string()
    .required('Coupon code is required')
    .min(3, 'Code must be at least 3 characters')
    .matches(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string(),
  discountType: Yup.string()
    .required('Discount type is required')
    .oneOf(['percentage', 'fixed']),
  discountValue: Yup.number()
    .required('Discount value is required')
    .positive('Must be a positive number'),
  minPurchaseAmount: Yup.number()
    .min(0, 'Must be 0 or greater'),
  maxDiscountAmount: Yup.number()
    .min(0, 'Must be 0 or greater'),
  maxRedemptions: Yup.number()
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1'),
  maxRedemptionsPerCustomer: Yup.number()
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1'),
  startDate: Yup.date()
    .required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  category: Yup.string(),
  termsConditions: Yup.string(),
});

const MerchantDashboard: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [couponsResponse, statsResponse] = await Promise.all([
        couponService.getMerchantCoupons(),
        couponService.getMerchantStats(),
      ]);

      if (couponsResponse.success && couponsResponse.data) {
        setCoupons(couponsResponse.data);
      }
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<CreateCouponRequest>({
    initialValues: {
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      maxRedemptions: 100,
      maxRedemptionsPerCustomer: 1,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      category: '',
      termsConditions: '',
    },
    validationSchema: couponValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = editingCoupon
          ? await couponService.updateCoupon(editingCoupon.id, values)
          : await couponService.createCoupon(values);

        if (response.success) {
          toast.success(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`);
          setCreateDialogOpen(false);
          resetForm();
          setEditingCoupon(null);
          fetchDashboardData();
        }
      } catch (error) {
        console.error('Error saving coupon:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    formik.resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    formik.setValues({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      maxRedemptions: coupon.maxRedemptions || 100,
      maxRedemptionsPerCustomer: coupon.maxRedemptionsPerCustomer || 1,
      startDate: format(new Date(coupon.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(coupon.endDate), 'yyyy-MM-dd'),
      category: coupon.category || '',
      termsConditions: coupon.termsConditions || '',
    });
    setCreateDialogOpen(true);
  };

  const handleDeleteCoupon = async (couponId: number) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await couponService.deleteCoupon(couponId);
      if (response.success) {
        toast.success('Coupon deleted successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      active: 'success',
      draft: 'default',
      paused: 'warning',
      expired: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <div>
            <Typography variant="h3" fontWeight="bold">
              Merchant Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your coupons and campaigns
            </Typography>
          </div>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateCoupon}
          >
            Create Coupon
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalOffer color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Coupons</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {stats?.totalCoupons || coupons.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {stats?.activeCoupons || coupons.filter(c => c.status === 'active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Claims</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  {stats?.totalClaims || coupons.reduce((sum, c) => sum + c.redeemedCount, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Visibility color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Draft</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {stats?.draftCoupons || coupons.filter(c => c.status === 'draft').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Coupons Table */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Your Coupons
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : coupons.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No coupons yet
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleCreateCoupon}
                  startIcon={<Add />}
                >
                  Create Your First Coupon
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Claims</TableCell>
                      <TableCell>Valid Until</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <Typography fontFamily="monospace" fontWeight="600">
                            {coupon.code}
                          </Typography>
                        </TableCell>
                        <TableCell>{coupon.title}</TableCell>
                        <TableCell>
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                        </TableCell>
                        <TableCell>
                          {coupon.redeemedCount}/{coupon.maxRedemptions || '∞'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(coupon.endDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={coupon.status.toUpperCase()}
                            color={getStatusColor(coupon.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditCoupon(coupon)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Create/Edit Coupon Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEditingCoupon(null);
          formik.resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="code"
                  label="Coupon Code"
                  value={formik.values.code}
                  onChange={(e) => formik.setFieldValue('code', e.target.value.toUpperCase())}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="category"
                  label="Category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="discountType"
                  label="Discount Type"
                  value={formik.values.discountType}
                  onChange={formik.handleChange}
                  required
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="fixed">Fixed Amount (₹)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="discountValue"
                  label="Discount Value"
                  type="number"
                  value={formik.values.discountValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.discountValue && Boolean(formik.errors.discountValue)}
                  helperText={formik.touched.discountValue && formik.errors.discountValue}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="minPurchaseAmount"
                  label="Min. Purchase Amount"
                  type="number"
                  value={formik.values.minPurchaseAmount}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="maxDiscountAmount"
                  label="Max. Discount Amount"
                  type="number"
                  value={formik.values.maxDiscountAmount}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="maxRedemptions"
                  label="Max Redemptions"
                  type="number"
                  value={formik.values.maxRedemptions}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="maxRedemptionsPerCustomer"
                  label="Max Per Customer"
                  type="number"
                  value={formik.values.maxRedemptionsPerCustomer}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="termsConditions"
                  label="Terms & Conditions"
                  multiline
                  rows={3}
                  value={formik.values.termsConditions}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditingCoupon(null);
            formik.resetForm();
          }}>
            Cancel
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={24} /> : (editingCoupon ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MerchantDashboard;
