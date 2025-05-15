// User-related type definitions
import { User, SavedJob } from '@prisma/client'

// Omit sensitive fields from user type
export type SafeUser = Omit<User, 'passwordHash'>

// Type for creating a new user
export interface UserCreateInput {
  email: string
  name?: string
  password: string
  profileImage?: string
}

// Type for saved job data
export type UserSavedJob = SavedJob & {
  jobDetails?: {
    title: string
    company: string
    // Add more job details as needed
  }
}