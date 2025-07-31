import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import { useToast } from '@/hooks/use-toast';

interface AuthUser {
  _id: string;
  email: string;
  name: string;
  type: 'Admin' | 'Staff' | 'Customer';
  role?: {
    _id: string;
    name: string;
    accessId?: string;
  };
  skills?: string[];
  seniority?: string;
  department?: string;
  maxCapacity?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('auth_token')
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user profile on app load if token exists
  useEffect(() => {
    if (token) {
      authApi.getProfile()
        .then((response) => {

          const userData = response.data || response;
          setUser({
            _id: userData._id,
            email: userData.email,
            name: userData.name,
            type: userData.type,
            role: userData.role,
            skills: userData.skills,
            seniority: userData.seniority,
            department: userData.department,
            maxCapacity: userData.maxCapacity,
          });
        })
        .catch((error) => {
          console.error('Profile fetch error:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await authApi.login(data);
      const authToken = response.accessToken;
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      
      const userData = response.data || response.user;
      
      setUser({
        _id: userData._id,
        email: userData.email,
        name: userData.name,
        type: userData.type,
        role: userData.role,
        skills: userData.skills,
        seniority: userData.seniority,
        department: userData.department,
        maxCapacity: userData.maxCapacity,
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    queryClient.clear();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Add auth token to requests
export function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
