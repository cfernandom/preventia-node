
export class UpdateUserRequest {
  firstName?: string
  lastName?: string
  oldPassword?: string
  password?: string
  confirmPassword?: string
  currentPassword?: string

  constructor (data: Partial<UpdateUserRequest>) {
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.oldPassword = data.oldPassword
    this.password = data.password
    this.confirmPassword = data.confirmPassword
    this.currentPassword = data.currentPassword
  }
}
