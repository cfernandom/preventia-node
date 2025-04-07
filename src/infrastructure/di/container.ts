import { container } from 'tsyringe'
import prisma from '../db/prisma-client'
import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { UserPrismaRepository } from '../db/UserPrismaRepository'
import { IHashService } from '../../domain/services/IHashService'
import { BcryptHashService } from '../services/BcryptHashService'
import { IJwtService } from '../../domain/services/IJwtService'
import { JwtService } from '../services/JwtService'
import { AuthService } from '../services/AuthService'
import { IAuthService } from '../../domain/services/IAuthService'

// Registro de instancias y servicios
container.registerInstance('PrismaClient', prisma)

container.register<IUserRepository>('IUserRepository', {
  useClass: UserPrismaRepository
})

container.register<IHashService>('IHashService', {
  useClass: BcryptHashService
})

container.register<IJwtService>('IJwtService', {
  useClass: JwtService
})

container.register<IAuthService>('IAuthService', {
  useClass: AuthService
})

export { container }
