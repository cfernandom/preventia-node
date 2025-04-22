import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { NotFoundError, UnauthorizedError, ValidationError } from '../../../common/errors'
import { UserProfileResponse } from '../dto/UserProfileResponse'
import { UpdateUserRequest } from '../dto/UserUpdateRequest'
import { UserUpdateResponse } from '../dto/UserUpdateResponse'
import { IHashService } from '../../../domain/services/IHashService'

@injectable()
export class UserController {
  constructor (
    @inject('IUserRepository') private readonly userService: IUserRepository,
    @inject('IHashService') private readonly hashService: IHashService
  ) {}

  async getProfile (req: Request, res: Response): Promise<void> {
    const userId = req.user?.id

    if (userId == null) {
      throw new UnauthorizedError('Authentication required')
    }

    const user = await this.userService.findById(userId)

    if (user == null) {
      throw new NotFoundError('User not found')
    }
    res.status(200).json(new UserProfileResponse(user))
  }

  async updateUser (req: Request, res: Response): Promise<void> {
    const userId = req.user?.id

    if (userId == null) {
      throw new UnauthorizedError('Authentication required')
    }

    const user = await this.userService.findById(userId)

    if (user == null) {
      throw new NotFoundError('User not found')
    }

    const updateData = new UpdateUserRequest(req.body)

    if (updateData.firstName != null) {
      user.firstName = updateData.firstName
    }
    if (updateData.lastName != null) {
      user.lastName = updateData.lastName
    }
    // Validación de contraseña
    if (updateData.currentPassword != null && updateData.password != null && updateData.confirmPassword != null) {
      console.log('Entra a la validación de contraseña')
      const isCurrentPasswordValid = await this.hashService.compare(
        updateData.currentPassword,
        user.passwordHash
      )
      if (!isCurrentPasswordValid) {
        throw new ValidationError('La contraseña actual es incorrecta')
      }
      if (updateData.password.trim() === updateData.confirmPassword.trim()) {
        const hashedPassword = await this.hashService.hash(updateData.password)
        user.passwordHash = hashedPassword
      } else {
        throw new ValidationError('Las contraseñas no coinciden')
      }
    }

    const updatedUser = await this.userService.update(user)
    res.status(200).json(new UserUpdateResponse(updatedUser))
  }
}
