import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { NotFoundError, UnauthorizedError } from '../../../common/errors'
import { UserProfileResponse } from '../dto/UserProfileResponse'

@injectable()
export class UserController {
  constructor (
    @inject('IUserRepository') private readonly userService: IUserRepository
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
}
