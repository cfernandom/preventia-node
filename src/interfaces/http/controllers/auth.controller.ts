import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IAuthService } from '../../../domain/services/IAuthService'

@injectable()
export class AuthController {
  constructor (
    @inject('IAuthService') private readonly authService: IAuthService
  ) { }

  async register (req: Request, res: Response): Promise<void> {
    const { email, password, firstName, lastName } = req.body
    const user = await this.authService.register(email, password, firstName, lastName)
    res.status(201).json(user)
  }

  async login (req: Request, res: Response): Promise<void> {
    const { email, password } = req.body
    const { token } = await this.authService.login(email, password)
    res.status(200).json({ token })
  }
}
