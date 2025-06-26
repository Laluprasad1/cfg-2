'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, authService } from './auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('AuthProvider: Loading current user');
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      console.log('AuthProvider: User loaded:', currentUser?.username);
    } catch (error) {
      console.error('AuthProvider: Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    console.log('AuthProvider: Login attempt for:', username);
    const result = await authService.login(username, password);
    
    if (result.success && result.user) {
      setUser(result.user);
      console.log('AuthProvider: Login successful, user set');
    }
    
    return { success: result.success, error: result.error };
  };

  const logout = () => {
    console.log('AuthProvider: Logging out user');
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

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