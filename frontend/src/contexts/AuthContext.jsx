import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pc_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pc_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      // optional: could validate token by pinging protected endpoint
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token: t } = res.data;
    localStorage.setItem('pc_token', t);
    localStorage.setItem('pc_user', JSON.stringify(u));
    setUser(u);
    setToken(t);
    setLoading(false);
    navigate('/');
  };

  const signup = async (payload) => {
    setLoading(true);
    const res = await api.post('/auth/signup', payload);
    const { user: u, token: t } = res.data;
    localStorage.setItem('pc_token', t);
    localStorage.setItem('pc_user', JSON.stringify(u));
    setUser(u);
    setToken(t);
    setLoading(false);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('pc_token');
    localStorage.removeItem('pc_user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
