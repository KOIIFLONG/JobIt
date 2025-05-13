import crypto from 'crypto';

/**
 * Configuration for password hashing
 */
const HASH_CONFIG = {
  saltLength: 32,  // 32 bytes of salt
  iterations: 10000, // PBKDF2 iterations
  keyLength: 64,   // 64 bytes (512 bits) output key
  digest: 'sha512' // Strong hash algorithm
};

/**
 * Generates a cryptographically secure random salt
 * @returns {string} Base64 encoded salt
 */
export function generateSalt(): string {
  // Use cryptographically secure random bytes
  const salt = crypto.randomBytes(HASH_CONFIG.saltLength);
  return salt.toString('base64');
}

/**
 * Hash a password using PBKDF2 (Password-Based Key Derivation Function 2)
 * @param password Plain text password
 * @param salt Optional salt (will generate if not provided)
 * @returns Object containing hashed password and salt
 */
export function hashPassword(password: string, salt?: string): { 
  hashedPassword: string; 
  salt: string 
} {
  // Validate input
  if (!password) {
    throw new Error('Password cannot be empty');
  }

  // Generate salt if not provided
  const currentSalt = salt || generateSalt();

  // Derive key using PBKDF2
  const hashedPassword = crypto.pbkdf2Sync(
    password, 
    currentSalt, 
    HASH_CONFIG.iterations, 
    HASH_CONFIG.keyLength, 
    HASH_CONFIG.digest
  ).toString('base64');

  return { hashedPassword, salt: currentSalt };
}

/**
 * Verify a password against a stored hash
 * @param password Plain text password to verify
 * @param storedHash Stored hashed password
 * @param storedSalt Stored salt
 * @returns Boolean indicating if password is correct
 */
export function verifyPassword(
  password: string, 
  storedHash: string, 
  storedSalt: string
): boolean {
  // Validate inputs
  if (!password || !storedHash || !storedSalt) {
    return false;
  }

  // Recompute hash with stored salt
  const { hashedPassword } = hashPassword(password, storedSalt);
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(storedHash, 'base64'), 
    Buffer.from(hashedPassword, 'base64')
  );
}