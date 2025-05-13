import { 
  generateSalt, 
  hashPassword, 
  verifyPassword 
} from '../lib/password-utils';

describe('Password Utilities', () => {
  // Test salt generation
  describe('generateSalt', () => {
    it('should generate unique salts', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      expect(salt1).not.toEqual(salt2);
    });

    it('should generate salt of expected length', () => {
      const salt = generateSalt();
      expect(salt.length).toBe(32);
    });
  });

  // Test password hashing
  describe('hashPassword', () => {
    const password = 'testPassword123!';

    it('should hash password successfully', () => {
      const { hashedPassword, salt } = hashPassword(password);
      
      expect(hashedPassword).toBeTruthy();
      expect(salt).toBeTruthy();
      expect(hashedPassword).not.toEqual(password);
    });

    it('should hash same password with different salt', () => {
      const result1 = hashPassword(password);
      const result2 = hashPassword(password);
      
      expect(result1.hashedPassword).not.toEqual(result2.hashedPassword);
      expect(result1.salt).not.toEqual(result2.salt);
    });

    it('should throw error for empty password', () => {
      expect(() => hashPassword('')).toThrow('Password cannot be empty');
    });

    it('should allow hashing with provided salt', () => {
      const salt = generateSalt();
      const { hashedPassword, salt: returnedSalt } = hashPassword(password, salt);
      
      expect(returnedSalt).toEqual(salt);
      expect(hashedPassword).toBeTruthy();
    });
  });

  // Test password verification
  describe('verifyPassword', () => {
    const password = 'testPassword123!';
    
    it('should verify correct password', () => {
      const { hashedPassword, salt } = hashPassword(password);
      const isValid = verifyPassword(password, hashedPassword, salt);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', () => {
      const { hashedPassword, salt } = hashPassword(password);
      const isValid = verifyPassword('wrongPassword', hashedPassword, salt);
      
      expect(isValid).toBe(false);
    });

    it('should reject empty inputs', () => {
      const isValid = verifyPassword('', '', Buffer.from(''));
      expect(isValid).toBe(false);
    });
  });
});