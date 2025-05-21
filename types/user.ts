import { z } from 'zod';

// User schema for validation
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
  emailVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLogin: z.date().optional(),
});

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const SavedJobSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobId: z.string(),
  savedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type SavedJob = z.infer<typeof SavedJobSchema>;