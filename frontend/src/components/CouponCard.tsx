import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  LocalOffer,
  CalendarToday,
  Store,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Coupon } from '../services/couponService';

interface CouponCardProps {
  coupon: Coupon;
  onClaim?: (couponId: number) => void;
  onRedeem?: (couponId: number) => void;
  onView?: (couponId: number) => void;
  showActions?: boolean;
  actionLabel?: string;
  isClaimed?: boolean;
  isRedeemed?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onClaim,
  onRedeem,
  onView,
  showActions = true,
  actionLabel,
  isClaimed = false,
  isRedeemed = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'expired':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDiscountText = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  const calculateRedemptionPercentage = () => {
    if (!coupon.maxRedemptions) return 0;
    return (coupon.redeemedCount / coupon.maxRedemptions) * 100;
  };

  const isExpired = new Date(coupon.endDate) < new Date();
  const isNotStarted = new Date(coupon.startDate) > new Date();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        opacity: isExpired || isRedeemed ? 0.7 : 1,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Status Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip
            label={isRedeemed ? 'REDEEMED' : isExpired ? 'EXPIRED' : isNotStarted ? 'UPCOMING' : coupon.status.toUpperCase()}
            color={isRedeemed ? 'default' : isExpired ? 'error' : getStatusColor(coupon.status)}
            size="small"
          />
          {coupon.category && (
            <Chip label={coupon.category} size="small" variant="outlined" />
          )}
        </Box>

        {/* Discount Display */}
        <Box
          sx={{
            textAlign: 'center',
            py: 2,
            mb: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 1,
          }}
        >
          <Typography variant="h4" component="div" fontWeight="bold">
            {getDiscountText()}
          </Typography>
          {coupon.maxDiscountAmount && (
            <Typography variant="caption">
              Max savings: ₹{coupon.maxDiscountAmount}
            </Typography>
          )}
        </Box>

        {/* Coupon Title */}
        <Typography variant="h6" gutterBottom fontWeight="600">
          {coupon.title}
        </Typography>

        {/* Description */}
        {coupon.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {coupon.description.length > 100
              ? `${coupon.description.substring(0, 100)}...`
              : coupon.description}
          </Typography>
        )}

        {/* Coupon Code */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
            p: 1,
            bgcolor: 'grey.100',
            borderRadius: 1,
          }}
        >
          <LocalOffer fontSize="small" />
          <Typography variant="body2" fontWeight="600" sx={{ fontFamily: 'monospace' }}>
            {coupon.code}
          </Typography>
        </Box>

        {/* Merchant Name */}
        {coupon.merchantName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Store fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {coupon.merchantName}
            </Typography>
          </Box>
        )}

        {/* Valid Dates */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Valid: {format(new Date(coupon.startDate), 'MMM dd')} - {format(new Date(coupon.endDate), 'MMM dd, yyyy')}
          </Typography>
        </Box>

        {/* Minimum Purchase */}
        {coupon.minPurchaseAmount && coupon.minPurchaseAmount > 0 && (
          <Typography variant="caption" color="text.secondary" display="block">
            Min. purchase: ₹{coupon.minPurchaseAmount}
          </Typography>
        )}

        {/* Redemption Progress */}
        {coupon.maxRedemptions && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Claimed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {coupon.redeemedCount} / {coupon.maxRedemptions}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateRedemptionPercentage()}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {onClaim && !isClaimed && !isExpired && !isNotStarted && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => onClaim(coupon.id)}
              disabled={coupon.maxRedemptions ? coupon.redeemedCount >= coupon.maxRedemptions : false}
            >
              {actionLabel || 'Claim Coupon'}
            </Button>
          )}
          {onRedeem && isClaimed && !isRedeemed && !isExpired && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => onRedeem(coupon.id)}
            >
              Redeem Now
            </Button>
          )}
          {onView && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onView(coupon.id)}
            >
              View Details
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default CouponCard;
