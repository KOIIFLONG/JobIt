import { prisma } from '../lib/prisma/client'

describe('User Database Schema', () => {
  it('should have createdAt and updatedAt timestamps automatically set', async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      }
    })

    // Check createdAt
    expect(user.createdAt).toBeDefined()
    expect(user.createdAt).toBeInstanceOf(Date)

    // Check updatedAt
    expect(user.updatedAt).toBeDefined()
    expect(user.updatedAt).toBeInstanceOf(Date)

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
  })

  it('should prevent duplicate email addresses', async () => {
    const email = 'unique@example.com'

    // First user creation should succeed
    const firstUser = await prisma.user.create({
      data: {
        email,
        passwordHash: 'hashedpassword123',
      }
    })

    // Second user creation with same email should fail
    await expect(
      prisma.user.create({
        data: {
          email,
          passwordHash: 'anotherhashedpassword',
        }
      })
    ).rejects.toThrow()

    // Cleanup
    await prisma.user.delete({ where: { id: firstUser.id } })
  })
})
