import bcrypt from 'bcrypt';
import { UserRegistration, UserRegistrationSchema } from '../validation/user';

// Simulate a user database (in a real app, this would be a database connection)
const users: Array<{username: string, email: string, hashedPassword: string}> = [];

export class UserService {
  static async registerUser(userData: UserRegistration) {
    // Validate input
    const validationResult = UserRegistrationSchema.safeParse(userData);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }

    // Check if user already exists
    const existingUser = users.find(
      user => user.email === userData.email || user.username === userData.username
    );
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Save user
    const newUser = {
      username: userData.username,
      email: userData.email,
      hashedPassword
    };
    users.push(newUser);

    // Return user without password
    return {
      username: newUser.username,
      email: newUser.email
    };
  }
}