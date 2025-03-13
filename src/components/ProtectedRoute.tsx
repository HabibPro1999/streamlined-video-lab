
import { useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Add a small delay to prevent flashing
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If we're on a blank page but have a user, redirect to dashboard
    if (user && !loading && !isChecking && location.pathname === "/") {
      navigate('/dashboard');
    }
  }, [user, loading, isChecking, location.pathname, navigate]);
  
  // Check if we're still loading authentication data
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If there's no user, redirect to the auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If we have a user and we're not loading, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
