import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: baseURL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

// attach token automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('pc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
