import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserData } from '../services/authService';

// Define the shape of the context
interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, defaultTaxMethod?: 'fifo' | 'lifo' | 'hifo' | 'acb', prefersDarkMode?: boolean) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string; profilePicture?: string; defaultTaxMethod?: 'fifo' | 'lifo' | 'hifo' | 'acb'; prefersDarkMode?: boolean; }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Authentication provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth status check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    defaultTaxMethod: 'fifo' | 'lifo' | 'hifo' | 'acb' = 'fifo',
    prefersDarkMode: boolean = true
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authService.register(
        name,
        email,
        password,
        defaultTaxMethod,
        prefersDarkMode
      );
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (userData: {
    name?: string;
    email?: string;
    profilePicture?: string;
    defaultTaxMethod?: 'fifo' | 'lifo' | 'hifo' | 'acb';
    prefersDarkMode?: boolean;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 