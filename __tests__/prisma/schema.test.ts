import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

// Fake data generators for testing
const createFakeUser = () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
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

  it('should create a user successfully', async () => {
    const userData = createFakeUser()
    const user = await prisma.user.create({
      data: userData,
    })

    expect(user).toBeDefined()
    expect(user.email).toBe(userData.email)
    expect(user.role).toBe('USER')
  })

  it('should prevent duplicate email registrations', async () => {
    const userData = createFakeUser()
    await prisma.user.create({ data: userData })

    await expect(
      prisma.user.create({ data: userData })
    ).rejects.toThrow()
  })

  it('should create a saved job for a user', async () => {
    const userData = createFakeUser()
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
    const userData = createFakeUser()
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