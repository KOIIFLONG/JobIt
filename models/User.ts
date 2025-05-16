import bcrypt from 'bcrypt';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

// Ensure Prisma client is created only once
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Input validation interface
export interface UserCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class User {
  static readonly MIN_PASSWORD_LENGTH = 8;
  static readonly MAX_PASSWORD_LENGTH = 128;

  /**
   * Validate user email format
   * @param email User's email address
   * @returns boolean indicating email validity
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param password User's password
   * @returns boolean indicating password validity
   */
  static validatePassword(password: string): boolean {
    return password.length >= this.MIN_PASSWORD_LENGTH && 
           password.length <= this.MAX_PASSWORD_LENGTH;
  }

  /**
   * Hash a user's password
   * @param password Plain text password
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare provided password with stored hash
   * @param password Plain text password
   * @param hashedPassword Stored hashed password
   * @returns boolean indicating password match
   */
  static async comparePassword(
    password: string, 
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Create a new user
   * @param userData User creation data
   * @returns Created user
   * @throws Error for invalid user data
   */
  static async create(userData: UserCreateInput): Promise<PrismaUser> {
    // Validate email
    if (!this.validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (!this.validatePassword(userData.password)) {
      throw new Error('Password does not meet requirements');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user in database
    return prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName
      }
    });
  }

  /**
   * Find user by email
   * @param email User's email
   * @returns User or null
   */
  static async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}
