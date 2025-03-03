import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, defaultTaxMethod, prefersDarkMode } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long' });
      return;
    }

    // Register user
    const user = await AuthService.registerUser({
      email,
      password,
      name,
      defaultTaxMethod,
      prefersDarkMode
    });

    // Generate token
    const token = AuthService.generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Login user
    const { user, token } = await AuthService.loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    
    // Handle invalid credentials
    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    
    res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Get current user (from JWT token)
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // The user ID is attached to the request by the auth middleware
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await AuthService.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, email, defaultTaxMethod, prefersDarkMode, profilePicture } = req.body;

    // Update user profile
    const updatedUser = await AuthService.updateUserProfile(userId, {
      name,
      email,
      defaultTaxMethod,
      prefersDarkMode,
      profilePicture
    });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle email already in use
    if (error instanceof Error && error.message.includes('already in use')) {
      res.status(409).json({ error: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long' });
      return;
    }

    // Update password
    const success = await AuthService.updatePassword(userId, currentPassword, newPassword);

    if (!success) {
      res.status(400).json({ error: 'Failed to update password' });
      return;
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    
    // Handle incorrect current password
    if (error instanceof Error && error.message.includes('Current password is incorrect')) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }
    
    // Handle user not found
    if (error instanceof Error && error.message.includes('User not found')) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(500).json({ error: 'Failed to change password' });
  }
}; 