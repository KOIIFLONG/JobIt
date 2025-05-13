import crypto from 'crypto';

/**
 * Generates a cryptographically secure random salt
 * @param {number} bytes - Number of bytes for the salt (default: 16)
 * @returns {string} Base64 encoded salt
 */
export function generateSalt(bytes: number = 16): string {
  // Use Node.js crypto to generate cryptographically secure random bytes
  const salt = crypto.randomBytes(bytes);
  return salt.toString('base64');
}

/**
 * Hash a password using PBKDF2 (Password-Based Key Derivation Function 2)
 * @param {string} password - Plain text password
 * @param {string} salt - Base64 encoded salt 
 * @param {number} iterations - Number of hash iterations (default: 100000)
 * @returns {string} Hashed password (base64 encoded)
 */
export function hashPassword(
  password: string, 
  salt?: string, 
  iterations: number = 100000
): { hashedPassword: string; salt: string } {
  // Generate salt if not provided
  const usedSalt = salt || generateSalt();

  // Convert salt back to buffer
  const saltBuffer = Buffer.from(usedSalt, 'base64');

  // Use SHA512 as the hash algorithm
  const hashedPassword = crypto.pbkdf2Sync(
    password, 
    saltBuffer, 
    iterations, 
    64, 
    'sha512'
  );

  // Return both hashed password and salt
  return {
    hashedPassword: hashedPassword.toString('base64'),
    salt: usedSalt
  };
}

/**
 * Verify a password against a stored hash
 * @param {string} inputPassword - Plain text password to verify
 * @param {string} storedHash - Previously hashed password
 * @param {string} storedSalt - Salt used in original hashing
 * @returns {boolean} Whether the password is correct
 */
export function verifyPassword(
  inputPassword: string, 
  storedHash: string, 
  storedSalt: string
): boolean {
  // Rehash the input password with the stored salt
  const { hashedPassword } = hashPassword(inputPassword, storedSalt);
  
  // Use constant time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(hashedPassword, 'base64'), 
    Buffer.from(storedHash, 'base64')
  );
}