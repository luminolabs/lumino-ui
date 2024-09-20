import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchWithAuth } from '@/utils/api';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  checkLoginStatus: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const checkLoginStatus = async () => {
    try {
      const userData = await fetchWithAuth('/users/me');
      setIsLoggedIn(true);
      setUserName(userData.name);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  const logout = () => {
    // Implement logout logic here
    setIsLoggedIn(false);
    setUserName('');
    // Additional logout logic (e.g., clearing tokens, redirecting)
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, checkLoginStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};