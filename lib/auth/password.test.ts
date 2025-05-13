import { 
  hashPassword, 
  verifyPassword, 
  isPasswordComplex 
} from './password';

describe('Password Utilities', () => {
  const validPassword = 'StrongP@ssw0rd123!';
  const invalidPassword = 'weak';

  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const hashedPassword = await hashPassword(validPassword);
      expect(hashedPassword).toBeTruthy();
      expect(hashedPassword).not.toBe(validPassword);
    });

    it('should throw error for short password', async () => {
      await expect(hashPassword('short')).rejects.toThrow();
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
  });

  describe('isPasswordComplex', () => {
    it('should validate complex password', () => {
      expect(isPasswordComplex(validPassword)).toBe(true);
    });

    it('should reject simple password', () => {
      expect(isPasswordComplex('simple')).toBe(false);
      expect(isPasswordComplex('onlylowercase123')).toBe(false);
      expect(isPasswordComplex('ONLYUPPERCASE123')).toBe(false);
      expect(isPasswordComplex('NoSpecialChars123')).toBe(false);
    });
  });
});