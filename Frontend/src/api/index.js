import axios from 'axios';

// Create an instance of axios
const API = axios.create({
  // Replace this with your actual backend URL
  baseURL: 'http://localhost:5000/api', 
});

// --- INTERCEPTOR: Automatically add Token to every request ---
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR: Handle Global Errors (Like 401 Unauthorized) ---
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is expired or invalid, log user out
      localStorage.clear();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default API;