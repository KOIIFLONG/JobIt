import { v4 as uuidv4 } from 'uuid';
import { User, LoginCredentials, AuthResponse } from './types';
import { AuthUtils } from './utils';

// Mock in-memory user store (replace with database in production)
const USERS: User[] = [];

export class AuthService {
  // User registration
  static async register(
    email: string, 
    password: string
  ): Promise<AuthResponse> {
    // Validate credentials
    const validationErrors = AuthUtils.validateLoginCredentials({ email, password });
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Check if user already exists
    const existingUser = USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    USERS.push(newUser);

    // Generate token and return response
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      token: AuthUtils.generateToken(userWithoutPassword),
      user: userWithoutPassword
    };
  }

  // User login
  static async login(
    credentials: LoginCredentials
  ): Promise<AuthResponse> {
    // Validate credentials
    const validationErrors = AuthUtils.validateLoginCredentials(credentials);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Find user
    const user = USERS.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(
      credentials.password, 
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token and return response
    const { password: _, ...userWithoutPassword } = user;
    return {
      token: AuthUtils.generateToken(userWithoutPassword),
      user: userWithoutPassword
    };
  }
}