'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';
import { users, demoCredentials } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('krishi-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const fullUser = users.find(u => u.id === parsedUser.id);
        if (fullUser) {
          setUser(fullUser);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('krishi-user');
    }
    setLoading(false);
  }, []);
  
  const login = (email: string, role: UserRole) => {
    const userToLogin = users.find(u => u.email === email && u.role === role);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('krishi-user', JSON.stringify({id: userToLogin.id, role: userToLogin.role}));
      router.push('/dashboard');
    } else {
        // This should be handled more gracefully in a real app
        alert('Invalid demo credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('krishi-user');
    router.push('/auth/login');
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname.startsWith('/auth');
      if (!isAuthenticated && !isAuthPage) {
        router.push('/auth/login');
      }
      if (isAuthenticated && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  const value = { user, isAuthenticated, login, logout, loading };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Prevent rendering auth pages if logged in, and app pages if not
  const isAuthPage = pathname.startsWith('/auth');
  if ( (isAuthenticated && isAuthPage) || (!isAuthenticated && !isAuthPage && pathname !== '/')) {
     return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
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
