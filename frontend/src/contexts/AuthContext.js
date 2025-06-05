import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Set default axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Verify token is still valid
          try {
            await axios.get('http://localhost:5000/auth/verify');
          } catch (error) {
            // Token is invalid, clear it
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(newToken);
      setUser(userData);

      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      console.log('Login successful for user:', userData.fullName, 'Role:', userData.role?.roleName);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:5000/auth/register', userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];

    console.log('User logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => {
    return !!(token && user);
  };

  const hasRole = (roleName) => {
    return user?.role?.roleName === roleName;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isEditor = () => {
    return hasRole('editor');
  };

  const isClient = () => {
    return hasRole('client');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    isAdmin,
    isEditor,
    isClient
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};