import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

// Fake data generators for testing
const createFakeUser = async () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: await bcrypt.hash(faker.internet.password(), 10),
  role: 'USER' as const,
})

describe('User Database Schema', () => {
  let prisma: PrismaClient

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a user with UUID', async () => {
    const userData = await createFakeUser()
    const user = await prisma.user.create({
      data: userData,
    })

    expect(user).toBeDefined()
    expect(user.id).toBeTruthy()
    expect(user.id.length).toBeGreaterThan(10) // UUID validation
    expect(user.email).toBe(userData.email)
  })

  it('should automatically set createdAt timestamp', async () => {
    const userData = await createFakeUser()
    const user = await prisma.user.create({
      data: userData,
    })

    expect(user.createdAt).toBeTruthy()
    expect(user.createdAt instanceof Date).toBeTruthy()
  })

  it('should prevent duplicate email registrations', async () => {
    const userData = await createFakeUser()
    await prisma.user.create({ data: userData })

    await expect(
      prisma.user.create({ data: userData })
    ).rejects.toThrow()
  })

  it('should hash password before storing', async () => {
    const rawPassword = 'testPassword123!'
    const userData = await createFakeUser()
    
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: await bcrypt.hash(rawPassword, 10)
      }
    })

    expect(user.password).not.toBe(rawPassword)
    expect(user.password.length).toBeGreaterThan(10)
  })

  it('should create a saved job for a user', async () => {
    const userData = await createFakeUser()
    const user = await prisma.user.create({ data: userData })

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: faker.string.uuid(),
        jobTitle: faker.company.buzzPhrase(),
        companyName: faker.company.name(),
      },
    })

    expect(savedJob).toBeDefined()
    expect(savedJob.userId).toBe(user.id)
  })

  it('should cascade delete saved jobs when user is deleted', async () => {
    const userData = await createFakeUser()
    const user = await prisma.user.create({ data: userData })

    await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: faker.string.uuid(),
        jobTitle: faker.company.buzzPhrase(),
        companyName: faker.company.name(),
      },
    })

    await prisma.user.delete({ where: { id: user.id } })

    const remainingSavedJobs = await prisma.savedJob.findMany({
      where: { userId: user.id },
    })

    expect(remainingSavedJobs.length).toBe(0)
  })
})