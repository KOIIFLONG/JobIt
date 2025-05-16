import { describe, it, expect } from 'vitest';
import { UserService } from '../lib/services/userService';
import bcrypt from 'bcrypt';

describe('UserService', () => {
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
    
    // Find the user in the internal users array (this is just for testing)
    const storedUser = (await import('../lib/services/userService')).users.find(
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