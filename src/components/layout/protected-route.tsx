import { useAuth } from '@/lib/auth';
import { Redirect, useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" replace />;
  }
  
  if (requiredRole && user?.type?.toLowerCase() !== requiredRole) {
    const redirectPath = user?.type?.toLowerCase() === 'manager' ? '/manager' : '/engineer';
    console.log('Redirecting to:', redirectPath);
    return <Redirect to={redirectPath} replace />;
  }

  return <>{children}</>;
}
