import { apiRequest } from './api';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  defaultTaxMethod: 'fifo' | 'lifo' | 'hifo' | 'acb';
  prefersDarkMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: UserData;
  token: string;
}

// Store token in localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const authService = {
  /**
   * Register a new user
   */
  register: async (
    name: string,
    email: string,
    password: string,
    defaultTaxMethod: 'fifo' | 'lifo' | 'hifo' | 'acb' = 'fifo',
    prefersDarkMode: boolean = true
  ): Promise<UserData> => {
    try {
      const response = await apiRequest<AuthResponse>({
        method: 'POST',
        url: '/auth/register',
        data: {
          name,
          email,
          password,
          defaultTaxMethod,
          prefersDarkMode
        }
      });
      
      // Save token and user data
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<UserData> => {
    try {
      const response = await apiRequest<AuthResponse>({
        method: 'POST',
        url: '/auth/login',
        data: {
          email,
          password
        }
      });
      
      // Save token and user data
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<UserData | null> => {
    try {
      // First try to get from localStorage
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      
      // If not in localStorage but token exists, fetch from API
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return null;
      }
      
      const response = await apiRequest<{ user: UserData }>({
        method: 'GET',
        url: '/auth/profile',
      });
      
      // Update localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Clear invalid token/data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (
    userData: {
      name?: string;
      email?: string;
      profilePicture?: string;
      defaultTaxMethod?: 'fifo' | 'lifo' | 'hifo' | 'acb';
      prefersDarkMode?: boolean;
    }
  ): Promise<UserData> => {
    try {
      const response = await apiRequest<{ message: string; user: UserData }>({
        method: 'PUT',
        url: '/auth/profile',
        data: userData
      });
      
      // Update localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
  
  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await apiRequest({
        method: 'POST',
        url: '/auth/change-password',
        data: {
          currentPassword,
          newPassword
        }
      });
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  /**
   * Get auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  }
};

export default authService; 