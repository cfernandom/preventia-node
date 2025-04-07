import { injectable } from 'tsyringe'
import bcrypt from 'bcrypt'
import { IHashService } from '../../domain/services/IHashService'

@injectable()
export class BcryptHashService implements IHashService {
  private readonly SALT_ROUNDS = 12

  async hash (plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.SALT_ROUNDS)
  }

  async compare (plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText)
  }
}
