import { Navigate } from 'react-router-dom';

// Prevent authenticated users from accessing auth pages
export const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If user is already logged in, redirect to their dashboard
  if (token && userRole) {
    if (userRole === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/customer/vendors" replace />;
    }
  }

  // Not authenticated, allow access to auth pages
  return children;
};

// Protect routes that require authentication
export const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/auth/role" replace />;
  }

  // Authenticated but wrong role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to correct dashboard based on actual role
    if (userRole === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/customer/vendors" replace />;
    }
  }

  // Authenticated and correct role
  return children;
};
