'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWrapper } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: number;
  email: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetchWrapper(`${API_URL}/auth/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const userData: User = await response.json();
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    } catch (err: any) {
      console.error("Fetch user error in AuthContext:", err.message); // Log the message from fetchWrapper
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      // Optionally, set the error state for the context consumers
      // setError(err.message || 'Failed to authenticate user.');
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      fetchUser(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (authToken: string) => {
    setIsLoading(true);
    await fetchUser(authToken);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}