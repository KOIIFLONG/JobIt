import * as bcrypt from 'bcrypt';
import { 
  generateSecureSalt,
  validatePasswordComplexity, 
  hashPassword, 
  verifyPassword 
} from './password';

describe('Password Security Utilities', () => {
  // Valid complex password for testing
  const validPassword = 'StrongP@ssw0rd123!';
  const invalidPasswords = [
    'short',  // too short
    'onlylowercase',  // missing uppercase, numbers, special chars
    'ONLYUPPERCASE',  // missing lowercase, numbers, special chars
    'NoSpecialChars123',  // missing special chars
  ];

  describe('generateSecureSalt', () => {
    it('should generate a unique salt each time', () => {
      const salt1 = generateSecureSalt();
      const salt2 = generateSecureSalt();
      
      expect(salt1).toBeDefined();
      expect(salt2).toBeDefined();
      expect(salt1).not.toEqual(salt2);
    });
  });

  describe('validatePasswordComplexity', () => {
    it('should validate complex password', () => {
      expect(validatePasswordComplexity(validPassword)).toBe(true);
    });

    it.each(invalidPasswords)('should reject invalid password: %s', (password) => {
      expect(validatePasswordComplexity(password)).toBe(false);
    });

    it('should handle empty password', () => {
      expect(validatePasswordComplexity('')).toBe(false);
      expect(validatePasswordComplexity(undefined as any)).toBe(false);
    });

    it('should allow custom complexity options', () => {
      // Less strict options
      expect(validatePasswordComplexity('simplePwd', { 
        minLength: 5, 
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSpecialChars: false 
      })).toBe(true);
    });
  });

  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const hashedPassword = await hashPassword(validPassword);
      
      expect(hashedPassword).toBeTruthy();
      expect(hashedPassword).not.toEqual(validPassword);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid password', async () => {
      await expect(hashPassword('weak')).rejects.toThrow('Password does not meet complexity requirements');
    });

    it('should use 12 rounds of bcrypt hashing', async () => {
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');
      
      await hashPassword(validPassword);
      
      expect(bcryptHashSpy).toHaveBeenCalledWith(
        validPassword, 
        12  // Verify 12 rounds are used
      );
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const hashedPassword = await hashPassword(validPassword);
      const result = await verifyPassword(validPassword, hashedPassword);
      
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hashedPassword = await hashPassword(validPassword);
      const result = await verifyPassword('WrongPassword123!', hashedPassword);
      
      expect(result).toBe(false);
    });

    it('should handle empty inputs', async () => {
      const result1 = await verifyPassword('', '');
      const result2 = await verifyPassword(undefined as any, undefined as any);
      
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
});
