import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

// Extend the Express Request interface to include the user object
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Authentication middleware for protected routes
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  // Extract the token from the 'Bearer token' format
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  try {
    // Verify the token
    const user = AuthService.verifyToken(token);
    
    // Attach the user to the request object
    req.user = user;
    
    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Optional authentication middleware - doesn't require auth but attaches user if token is valid
 */
export const optionalAuthenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  // Extract the token from the 'Bearer token' format
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    // No token, but that's okay - continue without authentication
    next();
    return;
  }
  
  try {
    // Verify the token
    const user = AuthService.verifyToken(token);
    
    // Attach the user to the request object
    req.user = user;
  } catch (error) {
    // Invalid token, but we'll continue anyway
    console.warn('Invalid authentication token:', error);
  }
  
  // Proceed to the next middleware/controller
  next();
}; 