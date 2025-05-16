import bcrypt from 'bcrypt'

// Password hashing utility
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10 // Recommended number of salt rounds
  return await bcrypt.hash(password, saltRounds)
}

// Password verification utility
export const verifyPassword = async (
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}