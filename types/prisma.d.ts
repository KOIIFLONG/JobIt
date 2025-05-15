import { User, SavedJob } from '@prisma/client'

// Extended types with additional methods or computed properties if needed
export interface ExtendedUser extends User {
  // Add any additional computed properties or methods
  fullName?: string
}

export interface ExtendedSavedJob extends SavedJob {
  // Add any additional computed properties or methods
  formattedSavedAt?: string
}