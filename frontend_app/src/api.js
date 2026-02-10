import axios from 'axios'

// If running in Docker (prod), use relative path (/ -> nginx)
// If running locally, hit gateway directly
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:8002';

const api = axios.create({
    baseURL:API_URL,
});

// Attach JWT if exists
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  export default api;