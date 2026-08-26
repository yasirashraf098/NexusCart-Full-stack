import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      addToast(`Welcome back, ${data.name}!`, 'success');
      return { success: true, user: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      addToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      addToast('Registration successful! OTP sent to your email.', 'info');
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      addToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-email', { email, otp });
      addToast('Email verified successfully!', 'success');
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed.';
      addToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    addToast('Logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
