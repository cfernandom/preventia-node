import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { IHashService } from '../../domain/services/IHashService'
import { IJwtService } from '../../domain/services/IJwtService'
import { User } from '../../domain/entities/User'
import { AuthenticationError, ValidationError } from '../../common/errors'
import { IAuthService } from '../../domain/services/IAuthService'

@injectable()
export class AuthService implements IAuthService {
  constructor (
    @inject('IUserRepository') private readonly userRepository: IUserRepository,
    @inject('IHashService') private readonly hashService: IHashService,
    @inject('IJwtService') private readonly jwtService: IJwtService
  ) {}

  async register (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User> {
    // Validación de campos obligatorios
    if (email?.trim() === '' || password?.trim() === '' || firstName?.trim() === '' || lastName?.trim() === '') {
      throw new ValidationError('Campos obligatorios faltantes')
    }
    // Validación de email único
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser != null) {
      await new Promise(resolve => setTimeout(resolve, 3000))
      throw new ValidationError(
        'El correo electrónico ya está en uso',
        { email }
      )
    }
    // Validación de contraseña
    const hashedPassword = await this.hashService.hash(password)
    const user = User.create(email, hashedPassword, firstName, lastName)

    return await this.userRepository.save(user)
  }

  async login (email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email)

    const dummyHash = await this.hashService.hash('dummyPassword')
    if (user == null) {
      await this.hashService.compare('dummyPassword', dummyHash)
      throw new AuthenticationError('invalid_credentials')
    }

    const isValidPassword = await this.hashService.compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw new AuthenticationError('invalid_credentials')
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`
    })

    return { token }
  }
}
