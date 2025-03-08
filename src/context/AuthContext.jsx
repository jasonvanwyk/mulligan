import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    console.log('Attempting login...');
    setLoading(true);
    setError(null);
    try {
      // Using basic authentication
      const auth = btoa(`${username}:${password}`);
      axios.defaults.headers.common['Authorization'] = `Basic ${auth}`;
      
      // Get user profile
      const response = await axios.get('/api/users/profile/');
      console.log('Login successful:', response.data);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Invalid username or password');
      delete axios.defaults.headers.common['Authorization'];
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    try {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const checkAuth = async () => {
    console.log('Checking authentication...');
    try {
      const response = await axios.get('/api/users/profile/');
      console.log('Auth check successful:', response.data);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Auth check failed:', err.response?.data || err.message);
      setUser(null);
      throw err;
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