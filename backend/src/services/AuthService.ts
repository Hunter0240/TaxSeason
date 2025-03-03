import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('WARNING: JWT_SECRET environment variable is not set!');
  console.error('This is a security risk. Please set JWT_SECRET in your environment or .env file.');
  // Don't exit in development, but log the warning
  if (process.env.NODE_ENV === 'production') {
    console.error('Running in production without JWT_SECRET is not allowed.');
    process.exit(1);
  }
}

const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData: {
    email: string;
    password: string;
    name: string;
    defaultTaxMethod?: 'fifo' | 'lifo' | 'hifo' | 'acb';
    prefersDarkMode?: boolean;
  }): Promise<IUser> {
    try {
      // Check if user with email already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = new User({
        email: userData.email.toLowerCase(),
        password: userData.password,
        name: userData.name,
        defaultTaxMethod: userData.defaultTaxMethod || 'fifo',
        prefersDarkMode: userData.prefersDarkMode !== undefined ? userData.prefersDarkMode : true,
      });

      // Save user to database
      await user.save();

      // Return user without password
      user.password = '';
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticate a user and generate a JWT token
   */
  async loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if password is correct
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      // Return user without password and token
      user.password = '';
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(user: IUser): string {
    const payload = {
      userId: user._id,
      email: user.email,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    userData: {
      name?: string;
      email?: string;
      profilePicture?: string;
      defaultTaxMethod?: 'fifo' | 'lifo' | 'hifo' | 'acb';
      prefersDarkMode?: boolean;
    }
  ): Promise<IUser | null> {
    try {
      // Make sure email is lowercase if provided
      if (userData.email) {
        userData.email = userData.email.toLowerCase();
        
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ 
          email: userData.email, 
          _id: { $ne: userId } 
        });
        
        if (existingUser) {
          throw new Error('Email is already in use');
        }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: userData },
        { new: true }
      ).select('-password');

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(); 