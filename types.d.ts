import { User, SavedJob } from '@prisma/client'

declare global {
  type UserWithoutPassword = Omit<User, 'passwordHash'>
  type SavedJobWithDetails = SavedJob & {
    user: UserWithoutPassword
  }
}