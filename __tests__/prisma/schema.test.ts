import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

// Secure user data generation
const createSecureUserData = async () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: await bcrypt.hash(faker.internet.password(), 10)
})

describe('User Database Schema', () => {
  let prisma: PrismaClient

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a user with auto-incrementing ID', async () => {
    const userData = await createSecureUserData()
    const user = await prisma.user.create({ data: userData })

    expect(user.id).toBeDefined()
    expect(typeof user.id).toBe('number')
    expect(user.id).toBeGreaterThan(0)
  })

  it('should enforce unique email constraint', async () => {
    const userData = await createSecureUserData()
    
    // First user creation should succeed
    const firstUser = await prisma.user.create({ data: userData })
    expect(firstUser).toBeTruthy()

    // Second user with same email should fail
    await expect(
      prisma.user.create({ data: userData })
    ).rejects.toThrow()
  })

  it('should automatically set createdAt timestamp', async () => {
    const userData = await createSecureUserData()
    const user = await prisma.user.create({ data: userData })

    expect(user.createdAt).toBeTruthy()
    expect(user.createdAt instanceof Date).toBeTruthy()
  })

  it('should store hashed password', async () => {
    const rawPassword = 'SecurePassword123!'
    const hashedPassword = await bcrypt.hash(rawPassword, 10)
    
    const userData = await createSecureUserData()
    const user = await prisma.user.create({ 
      data: { 
        ...userData, 
        password: hashedPassword 
      } 
    })

    expect(user.password).not.toBe(rawPassword)
    expect(user.password.length).toBeGreaterThan(20)
    
    // Verify password can be compared
    const isPasswordValid = await bcrypt.compare(rawPassword, user.password)
    expect(isPasswordValid).toBeTruthy()
  })

  it('should create and cascade delete saved jobs', async () => {
    const userData = await createSecureUserData()
    const user = await prisma.user.create({ data: userData })

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: faker.string.uuid(),
        jobTitle: faker.company.buzzPhrase(),
        companyName: faker.company.name(),
      },
    })

    expect(savedJob.userId).toBe(user.id)

    // Cascade delete test
    await prisma.user.delete({ where: { id: user.id } })
    
    const remainingJobs = await prisma.savedJob.findMany({
      where: { userId: user.id }
    })

    expect(remainingJobs.length).toBe(0)
  })
})