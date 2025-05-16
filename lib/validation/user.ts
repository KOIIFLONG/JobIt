import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  
  email: z.string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    })
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;