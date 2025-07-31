import { useState } from 'react';
import { Redirect } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Redirect to={user.type === 'Manager' ? '/manager' : '/engineer'} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ERMS</CardTitle>
          <CardDescription>
            Sign in to your Engineering Resource Management System account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="mb-2">Demo credentials:</p>
            <div className="text-xs bg-gray-50 p-3 rounded">
              <p><strong>Manager:</strong> manager@company.com / manager123</p>
              <p><strong>Engineer:</strong> carol@company.com / engineer123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
