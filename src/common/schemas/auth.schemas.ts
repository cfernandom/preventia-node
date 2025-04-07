import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email must be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be at most 100 characters' }),
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name must be at most 50 characters' })
})

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email must be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
})
