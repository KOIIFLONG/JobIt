import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

describe('User Database Schema', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a user with hashed password', async () => {
    const rawPassword = 'securePassword123'
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: hashedPassword,
        username: 'testuser'
      }
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.passwordHash).not.toBe(rawPassword)
    expect(user.createdAt).toBeTruthy()
  })

  it('should enforce unique email constraint', async () => {
    const email = 'unique@example.com'
    
    await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash('password123', 10)
      }
    })

    await expect(prisma.user.create({
      data: {
        email, // Duplicate email
        passwordHash: await bcrypt.hash('differentpassword', 10)
      }
    })).rejects.toThrow()
  })

  it('should create a saved job for a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'jobsaver@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        savedJobs: {
          create: {
            jobId: 'job123',
            jobTitle: 'Software Engineer',
            companyName: 'Tech Corp'
          }
        }
      },
      include: {
        savedJobs: true
      }
    })

    expect(user.savedJobs.length).toBe(1)
    expect(user.savedJobs[0].jobTitle).toBe('Software Engineer')
  })
})