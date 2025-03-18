import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, getCsrfToken, withRateLimit } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  // Rate-limited login function
  const login = withRateLimit(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest.post('/api/users/login/', {
        username,
        password
      });
      
      const { token, user: userData } = response;
      
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Update the API client's authorization header
      apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred during login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, 1000); // 1 second delay between login attempts

  const logout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      
      // Remove authorization header
      delete apiRequest.defaults.headers.common['Authorization'];
      
      // Clear user state
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Set the authorization header
      apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;

      // Fetch user profile
      const userData = await apiRequest.get('/api/users/profile/');
      setUser(userData);
      return userData;
    } catch (err) {
      // If there's an authentication error, clear everything
      localStorage.removeItem('authToken');
      delete apiRequest.defaults.headers.common['Authorization'];
      setUser(null);
      setError('Authentication failed. Please log in again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 