import { User } from '../../../domain/entities/User'

export class UserProfileResponse {
  public readonly id: string
  public readonly email: string
  public readonly firstName: string
  public readonly lastName: string
  public readonly createdAt: Date

  constructor (user: User) {
    this.id = user.id
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.createdAt = user.createdAt
  }
}
