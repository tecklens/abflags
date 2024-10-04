import { useAuth } from '@client/context/auth'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/sign-in" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
