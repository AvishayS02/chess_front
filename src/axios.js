import axios from 'axios';

// Create an axios instance to configure default settings
const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your backend's base URL
});

// Add an interceptor to add the JWT token to every request if it's available
instance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      // Attach token to Authorization header for every request
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
