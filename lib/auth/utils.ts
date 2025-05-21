import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, LoginCredentials, AuthResponse } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
const SALT_ROUNDS = 10;

export class AuthUtils {
  // Hash password using bcrypt
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  // Compare provided password with stored hash
  static async comparePassword(
    providedPassword: string, 
    storedHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(providedPassword, storedHash);
  }

  // Generate JWT token
  static generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
  }

  // Validate JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Validate login credentials
  static validateLoginCredentials(
    credentials: LoginCredentials
  ): string[] {
    const errors: string[] = [];

    // Email validation
    if (!credentials.email) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (!credentials.password) {
      errors.push('Password is required');
    } else if (credentials.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }
}