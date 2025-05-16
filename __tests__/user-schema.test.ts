import { prisma } from '../lib/db/prisma'

describe('User Database Schema', () => {
  it('should create a user with required fields', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword123', // Note: In real app, use bcrypt
      }
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.createdAt).toBeTruthy()
  })

  it('should create a saved job for a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'saveduser@example.com',
        password: 'hashedpassword123',
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

  it('should prevent duplicate job saves for same user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'duplicate@example.com',
        password: 'hashedpassword123',
        savedJobs: {
          create: {
            jobId: 'uniquejob123',
            jobTitle: 'Product Manager',
            companyName: 'Innovate Inc'
          }
        }
      }
    })

    await expect(prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: 'uniquejob123', // Duplicate job ID
        jobTitle: 'Another Product Manager',
        companyName: 'Different Company'
      }
    })).rejects.toThrow()
  })
})