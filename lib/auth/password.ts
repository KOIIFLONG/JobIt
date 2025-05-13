import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

// Constants for password security
const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

// Password complexity requirements
interface PasswordComplexityOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

const DEFAULT_COMPLEXITY_OPTIONS: PasswordComplexityOptions = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

/**
 * Generate a cryptographically secure random salt
 * @returns Secure random salt
 */
export const generateSecureSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Validate password complexity
 * @param password - Password to validate
 * @param options - Complexity requirements
 * @returns Boolean indicating password meets complexity requirements
 */
export const validatePasswordComplexity = (
  password: string, 
  options: PasswordComplexityOptions = DEFAULT_COMPLEXITY_OPTIONS
): boolean => {
  // Ensure password is not empty or undefined
  if (!password) return false;

  // Check minimum length
  if (password.length < (options.minLength || MIN_PASSWORD_LENGTH)) {
    return false;
  }

  // Uppercase check
  if (options.requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }

  // Lowercase check
  if (options.requireLowercase && !/[a-z]/.test(password)) {
    return false;
  }

  // Number check
  if (options.requireNumbers && !/[0-9]/.test(password)) {
    return false;
  }

  // Special character check
  if (options.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  return true;
};

/**
 * Securely hash a password
 * @param password - Plain text password
 * @returns Hashed password
 * @throws Error if password is invalid
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Validate password complexity before hashing
  if (!validatePasswordComplexity(password)) {
    throw new Error('Password does not meet complexity requirements');
  }

  try {
    // Use bcrypt with 12 rounds and generate a secure salt
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('Password hashing failed', error);
    throw new Error('Failed to hash password');
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
    // Use constant-time comparison to prevent timing attacks
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification failed', error);
    return false;
  }
};
