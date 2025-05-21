import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './service';

describe('AuthService', () => {
  beforeEach(() => {
    // Reset any potential global state between tests
  });

  describe('User Registration', () => {
    it('should register a new user', async () => {
      const result = await AuthService.register(
        'newuser@example.com', 
        'validpassword'
      );

      expect(result.user.email).toBe('newuser@example.com');
      expect(result.token).toBeTruthy();
    });

    it('should prevent duplicate user registration', async () => {
      await AuthService.register(
        'duplicate@example.com', 
        'validpassword'
      );

      await expect(
        AuthService.register(
          'duplicate@example.com', 
          'anotherpassword'
        )
      ).rejects.toThrow('User already exists');
    });

    it('should fail registration with invalid email', async () => {
      await expect(
        AuthService.register(
          'invalidemail', 
          'validpassword'
        )
      ).rejects.toThrow('Invalid email format');
    });
  });

  describe('User Login', () => {
    it('should login with correct credentials', async () => {
      // First register a user
      await AuthService.register(
        'logintest@example.com', 
        'validpassword'
      );

      // Then login
      const result = await AuthService.login({
        email: 'logintest@example.com',
        password: 'validpassword'
      });

      expect(result.user.email).toBe('logintest@example.com');
      expect(result.token).toBeTruthy();
    });

    it('should fail login with incorrect password', async () => {
      // First register a user
      await AuthService.register(
        'logintest2@example.com', 
        'validpassword'
      );

      // Then attempt login with wrong password
      await expect(
        AuthService.login({
          email: 'logintest2@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});