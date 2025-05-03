import { PrismaClient, User as PrismaUser } from '@prisma/client'
import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { inject, injectable } from 'tsyringe'
import { User } from '../../domain/entities/User'

@injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor (
    @inject('PrismaClient') private readonly prisma: PrismaClient
  ) {}

  private toDomainEntity (dbUser: PrismaUser): User {
    return new User({
      id: dbUser.id,
      email: dbUser.email,
      passwordHash: dbUser.password_hash,
      firstName: dbUser.first_name ?? '',
      lastName: dbUser.last_name ?? '',
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at
    })
  }

  async findByEmail (email: string): Promise<User | null> {
    const dbUser = await this.prisma.user.findUnique({
      where: { email }
    })
    return (dbUser != null) ? this.toDomainEntity(dbUser) : null
  }

  async findById (id: string): Promise<User | null> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id }
    })
    return (dbUser != null) ? this.toDomainEntity(dbUser) : null
  }

  async save (user: User): Promise<User> {
    const dbUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        password_hash: user.passwordHash,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      }
    })
    return this.toDomainEntity(dbUser)
  }

  async update (user: User): Promise<User> {
    const dbUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        password_hash: user.passwordHash,
        updated_at: user.updatedAt
      }
    })
    return this.toDomainEntity(dbUser)
  }

  async delete (id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }

  async findAll ({ offset, limit }: { offset: number, limit: number }): Promise<User[]> {
    const dbUsers = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    })
    return dbUsers.map(this.toDomainEntity)
  }
}
