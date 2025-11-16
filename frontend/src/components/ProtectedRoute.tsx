import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireRole?: 'admin' | 'merchant' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'merchant') {
      return <Navigate to="/merchant/dashboard" replace />;
    } else if (user.role === 'customer') {
      return <Navigate to="/customer/coupons" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
