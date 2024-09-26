import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchWithAuth } from '@/utils/api';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  isLoading: boolean;
  checkLoginStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async (): Promise<boolean> => {
    try {
      const userData = await fetchWithAuth('/users/me');
      setIsLoggedIn(true);
      setUserName(userData.name);
      return true;
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUserName('');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToAuth0 = async (isLogout: boolean = false) => {
    try {
      const response = await fetch('/api/settings');
      const settings = await response.json();
      const endpoint = isLogout ? 'v1/auth0/logout' : 'v1/auth0/login';
      window.location.href = `${settings.API_BASE_URL}${endpoint}`;
    } catch (error) {
      console.error('Error redirecting to Auth0:', error);
    }
  };

  const logout = async () => {
    try {
      // Call the backend logout endpoint if you have one
      await fetchWithAuth('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggedIn(false);
      setUserName('');
      // Redirect to Auth0 logout page
      await redirectToAuth0(true);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, isLoading, checkLoginStatus, logout }}>
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