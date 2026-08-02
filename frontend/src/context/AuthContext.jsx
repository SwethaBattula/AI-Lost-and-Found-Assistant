import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Use sessionStorage to ensure session expires when browser/server restarts
  const [token, setToken] = useState(() => {
    // Clear legacy persistent localStorage items to enforce fresh login requirements
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    return sessionStorage.getItem('jwt_token') || null;
  });

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem('jwt_token');
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          sessionStorage.setItem('user_info', JSON.stringify(userData));
        } catch (err) {
          console.error('Failed to fetch user profile on init:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const accessToken = data.access_token;
    const userData = data.user;

    setToken(accessToken);
    setUser(userData);

    sessionStorage.setItem('jwt_token', accessToken);
    sessionStorage.setItem('user_info', JSON.stringify(userData));
    return userData;
  };

  const register = async (fullName, email, password) => {
    await authService.register(fullName, email, password);
    return await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_info');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
