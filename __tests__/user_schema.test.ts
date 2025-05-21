import { describe, it, expect } from 'vitest';
import { UserSchema, UserRegistrationSchema, SavedJobSchema } from '../types/user';

describe('User Authentication Schema', () => {
  it('should validate a complete user object', () => {
    const validUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      profilePictureUrl: 'https://example.com/profile.jpg',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    };

    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should validate user registration', () => {
    const validRegistration = {
      email: 'test@example.com',
      password: 'securePassword123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    const result = UserRegistrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidUser = {
      email: 'invalid-email',
      password: 'short',
    };

    const result = UserRegistrationSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should validate saved job', () => {
    const validSavedJob = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      jobId: 'job123',
      savedAt: new Date(),
    };

    const result = SavedJobSchema.safeParse(validSavedJob);
    expect(result.success).toBe(true);
  });
});