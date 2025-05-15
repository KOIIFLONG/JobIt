import { PrismaClient } from '@prisma/client'

describe('User Database Schema', () => {
  let prisma: PrismaClient

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('User model has correct fields', async () => {
    const userFields = Object.keys(await prisma.user.fields)
    const expectedFields = [
      'id', 
      'email', 
      'name', 
      'passwordHash', 
      'profileImage', 
      'createdAt', 
      'updatedAt'
    ]

    expectedFields.forEach(field => {
      expect(userFields).toContain(field)
    })
  })

  test('SavedJob model has correct fields', async () => {
    const savedJobFields = Object.keys(await prisma.savedJob.fields)
    const expectedFields = [
      'id', 
      'userId', 
      'jobId', 
      'jobTitle', 
      'company', 
      'location', 
      'savedAt'
    ]

    expectedFields.forEach(field => {
      expect(savedJobFields).toContain(field)
    })
  })

  test('User-SavedJob relationship is correct', async () => {
    const userRelations = await prisma.user.fields.savedJobs

    expect(userRelations).toBeDefined()
    expect(userRelations.type).toBe('SavedJob[]')
  })
})