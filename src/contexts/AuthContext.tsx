import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { getUser as getStoredUser, removeUser as removeStoredUser, saveUser as saveStoredUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const campusConnectUser = getStoredUser<User>();
    if (campusConnectUser) {
      setUser(campusConnectUser);
      return;
    }

    const legacy = localStorage.getItem('campus_user');
    if (legacy) setUser(JSON.parse(legacy));
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    saveStoredUser(userData);
    localStorage.setItem('campus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    removeStoredUser();
    localStorage.removeItem('campus_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
