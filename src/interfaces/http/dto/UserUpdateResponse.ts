export class UserUpdateResponse {
  id: string
  firstName: string
  lastName: string

  constructor (user: any) {
    this.id = user.id
    this.firstName = user.firstName
    this.lastName = user.lastName
  }
}
