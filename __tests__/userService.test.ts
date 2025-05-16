import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../lib/services/userService';
import bcrypt from 'bcrypt';

describe('UserService', () => {
  // Import the actual implementation to access and reset users
  const userServiceModule = require('../lib/services/userService');

  beforeEach(() => {
    // Reset the users array before each test
    userServiceModule.users.length = 0;
  });

  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'SecurePass123!'
  };

  it('should successfully register a new user', async () => {
    const result = await UserService.registerUser(validUser);
    
    expect(result).toEqual({
      username: validUser.username,
      email: validUser.email
    });
  });

  it('should throw an error when registering with an existing email', async () => {
    await UserService.registerUser(validUser);

    await expect(UserService.registerUser({
      username: 'differentuser',
      email: validUser.email,
      password: 'AnotherSecurePass123!'
    })).rejects.toThrow('User with this email or username already exists');
  });

  it('should throw an error for invalid username', async () => {
    await expect(UserService.registerUser({
      ...validUser,
      username: 'ab' // too short
    })).rejects.toThrow('Username must be at least 3 characters long');
  });

  it('should throw an error for invalid email', async () => {
    await expect(UserService.registerUser({
      ...validUser,
      email: 'invalid-email'
    })).rejects.toThrow('Invalid email address');
  });

  it('should throw an error for weak password', async () => {
    await expect(UserService.registerUser({
      ...validUser,
      password: 'weak'
    })).rejects.toThrow('Password must be at least 8 characters long');
  });

  it('should hash the password correctly', async () => {
    const result = await UserService.registerUser(validUser);
    
    const storedUser = userServiceModule.users.find(
      u => u.email === validUser.email
    );

    expect(storedUser).toBeTruthy();
    const passwordMatch = await bcrypt.compare(
      validUser.password, 
      storedUser!.hashedPassword
    );
    expect(passwordMatch).toBe(true);
  });
});