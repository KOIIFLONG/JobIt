import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { User, prisma } from '../models/User';
import { PrismaClient } from '@prisma/client';

describe('User Model', () => {
  let originalPrismaClient: PrismaClient;

  beforeAll(() => {
    // Store original Prisma client to reset after tests
    originalPrismaClient = prisma;
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.$disconnect();
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com', 
        'user.name@domain.co', 
        'user+tag@subdomain.example.org'
      ];
      validEmails.forEach(email => {
        expect(User.validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email', 
        'missing@domain', 
        '@missing-username.com', 
        'invalid@.com'
      ];
      invalidEmails.forEach(email => {
        expect(User.validateEmail(email)).toBe(false);
      });
    });
  });

  describe('Password Validation', () => {
    it('should validate password length', () => {
      const validPasswords = [
        '12345678', 
        'strongpassword', 
        'a'.repeat(User.MAX_PASSWORD_LENGTH)
      ];
      validPasswords.forEach(password => {
        expect(User.validatePassword(password)).toBe(true);
      });
    });

    it('should reject passwords that are too short or too long', () => {
      const invalidPasswords = [
        '1234567', 
        'a'.repeat(User.MAX_PASSWORD_LENGTH + 1)
      ];
      invalidPasswords.forEach(password => {
        expect(User.validatePassword(password)).toBe(false);
      });
    });
  });

  describe('User Creation', async () => {
    const validUserData = {
      email: `test-${Date.now()}@example.com`,
      password: 'validpassword123',
      firstName: 'John',
      lastName: 'Doe'
    };

    it('should create a user with valid data', async () => {
      const user = await User.create(validUserData);
      
      expect(user.email).toBe(validUserData.email);
      expect(user.firstName).toBe(validUserData.firstName);
      expect(user.lastName).toBe(validUserData.lastName);
      expect(user.password).not.toBe(validUserData.password); // Should be hashed
      expect(user.id).toBeDefined(); // UUID should be generated
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const duplicateEmail = `duplicate-${Date.now()}@example.com`;
      const userData = { 
        ...validUserData, 
        email: duplicateEmail 
      };

      // Create first user
      await User.create(userData);

      // Try to create second user with same email
      await expect(User.create(userData)).rejects.toThrow('Email already in use');
    });

    it('should throw error for invalid email', async () => {
      const invalidUser = { 
        ...validUserData, 
        email: 'invalid-email' 
      };
      
      await expect(User.create(invalidUser)).rejects.toThrow('Invalid email format');
    });

    it('should throw error for invalid password', async () => {
      const shortPasswordUser = { 
        ...validUserData, 
        password: '1234' 
      };
      
      await expect(User.create(shortPasswordUser)).rejects.toThrow('Password does not meet requirements');
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords differently for same input', async () => {
      const password = 'testpassword123';
      const hash1 = await User.hashPassword(password);
      const hash2 = await User.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should compare passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await User.hashPassword(password);
      
      const correctMatch = await User.comparePassword(password, hashedPassword);
      const incorrectMatch = await User.comparePassword('wrongpassword', hashedPassword);
      
      expect(correctMatch).toBe(true);
      expect(incorrectMatch).toBe(false);
    });
  });
});
