import type { User, SavedJob } from '@prisma/client'

// Type definition for User model without sensitive fields
export type SafeUser = Omit<User, 'passwordHash'>

// Type definition for SavedJob model
export type UserSavedJob = SavedJob

// Type for User creation input
export interface UserCreateInput {
  email: string
  username: string
  passwordHash: string
  firstName?: string
  lastName?: string
  profileImage?: string
}

// Type for SavedJob creation input
export interface SavedJobCreateInput {
  userId: string
  jobId: string
  jobTitle: string
  companyName: string
}