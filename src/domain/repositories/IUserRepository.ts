import { User } from '../entities/User'

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: string) => Promise<User | null>
  save: (user: User) => Promise<User>
  update: (user: User) => Promise<User>
  delete: (id: string) => Promise<void>
  findAll: (params: { offset: number, limit: number }) => Promise<User[]>
}
