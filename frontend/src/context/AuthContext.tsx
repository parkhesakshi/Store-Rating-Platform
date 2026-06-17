import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import { api } from '../services/api';
import type { User, LoginCredentials, RegisterData } from '../types';
import { getErrorMessage } from '../lib/error-handler';
import { AppError } from '../lib/custom-error';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setToken(storedToken);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    if (isMounted.current) {
      setIsLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Login failed');
      
      if (error instanceof AxiosError) {
        throw new AppError(errorMessage, {
          statusCode: error.response?.status,
          responseData: error.response?.data,
          originalError: error,
        });
      }
      
      throw new AppError(errorMessage, {
        originalError: error,
      });
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Registration failed');
      
      if (error instanceof AxiosError) {
        throw new AppError(errorMessage, {
          statusCode: error.response?.status,
          responseData: error.response?.data,
          originalError: error,
        });
      }
      
      throw new AppError(errorMessage, {
        originalError: error,
      });
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Password change failed');
      
      if (error instanceof AxiosError) {
        throw new AppError(errorMessage, {
          statusCode: error.response?.status,
          responseData: error.response?.data,
          originalError: error,
        });
      }
      
      throw new AppError(errorMessage, {
        originalError: error,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      changePassword,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};