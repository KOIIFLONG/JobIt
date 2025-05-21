import { describe, it, expect } from 'vitest';
import { AuthUtils } from './utils';

describe('AuthUtils', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'testpassword';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should compare correct password', async () => {
      const password = 'testpassword';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      const result = await AuthUtils.comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should fail when comparing incorrect password', async () => {
      const password = 'testpassword';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      const result = await AuthUtils.comparePassword('wrongpassword', hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('Login Credential Validation', () => {
    it('should validate correct credentials', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'validpassword'
      };

      const errors = AuthUtils.validateLoginCredentials(credentials);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid email', () => {
      const credentials = {
        email: 'invalidemail',
        password: 'validpassword'
      };

      const errors = AuthUtils.validateLoginCredentials(credentials);
      expect(errors).toContain('Invalid email format');
    });

    it('should fail with short password', () => {
      const credentials = {
        email: 'test@example.com',
        password: '12345'
      };

      const errors = AuthUtils.validateLoginCredentials(credentials);
      expect(errors).toContain('Password must be at least 6 characters long');
    });
  });
});