import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (accessToken, refreshToken, userName) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('username', userName);

    setToken(accessToken);
    setUsername(userName);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');

    setToken(null);
    setUsername('');
    setIsLoggedIn(false);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);
      setToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, token, username, login, logout, refreshAccessToken }}>
      {children}
    </LoginContext.Provider>
  );
};


const decodeJwt = (token) => {
  if (!token) {
    console.error('Token is missing or invalid');
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
