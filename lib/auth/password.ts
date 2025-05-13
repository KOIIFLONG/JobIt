import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Recommended secure number of salt rounds

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Input validation
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Verify a password against its hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hashed password to compare against
 * @returns Boolean indicating if password is correct
 */
export const verifyPassword = async (
  password: string, 
  hashedPassword: string
): Promise<boolean> => {
  // Input validation
  if (!password || !hashedPassword) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

/**
 * Check password complexity
 * @param password - Password to validate
 * @returns Boolean indicating password meets complexity requirements
 */
export const isPasswordComplex = (password: string): boolean => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
};