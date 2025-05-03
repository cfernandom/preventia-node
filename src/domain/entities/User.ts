import { z } from 'zod'

export class User {
  readonly id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  readonly createdAt: Date
  updatedAt?: Date

  constructor (props: UserProps) {
    UserSchema.parse(props)
    this.id = props.id
    this.email = props.email
    this.passwordHash = props.passwordHash
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create (
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string
  ): User {
    const props: UserProps = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      firstName,
      lastName,
      createdAt: new Date()
    }

    return new User(props)
  }
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email format'),
  passwordHash: z.string().min(10, 'Password must be at least 10 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional()
})

export type UserProps = z.infer<typeof UserSchema>
export type UserUpdateProps = Partial<UserProps>
export type UserCreateProps = Omit<UserProps, 'id' | 'created_at' | 'updated_at'>
