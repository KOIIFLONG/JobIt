import { generateSalt, hashPassword, verifyPassword } from '../lib/password-utils';

describe('Password Utility Functions', () => {
  // Salt Generation Tests
  describe('generateSalt', () => {
    it('should generate a salt with default length', () => {
      const salt = generateSalt();
      expect(salt).toBeTruthy();
      expect(salt.length).toBeGreaterThan(0);
    });

    it('should generate unique salts', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      expect(salt1).not.toEqual(salt2);
    });

    it('should generate salt with custom length', () => {
      const customLengthSalt = generateSalt(32);
      const defaultSalt = generateSalt();
      expect(customLengthSalt.length).toBeGreaterThan(defaultSalt.length);
    });
  });

  // Password Hashing Tests
  describe('hashPassword', () => {
    const testPassword = 'securePassword123!';

    it('should hash a password with a generated salt', () => {
      const { hashedPassword, salt } = hashPassword(testPassword);
      
      expect(hashedPassword).toBeTruthy();
      expect(salt).toBeTruthy();
      expect(hashedPassword).not.toEqual(testPassword);
    });

    it('should hash a password with a provided salt', () => {
      const providedSalt = generateSalt();
      const { hashedPassword, salt } = hashPassword(testPassword, providedSalt);
      
      expect(hashedPassword).toBeTruthy();
      expect(salt).toEqual(providedSalt);
    });
  });

  // Password Verification Tests
  describe('verifyPassword', () => {
    const testPassword = 'securePassword123!';

    it('should verify a correct password', () => {
      const { hashedPassword, salt } = hashPassword(testPassword);
      
      const isValid = verifyPassword(testPassword, hashedPassword, salt);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', () => {
      const { hashedPassword, salt } = hashPassword(testPassword);
      
      const isValid = verifyPassword('wrongPassword', hashedPassword, salt);
      expect(isValid).toBe(false);
    });
  });
});