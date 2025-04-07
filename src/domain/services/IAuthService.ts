import { User } from '../entities/User'

export interface IAuthService {
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<User>
  login: (email: string, password: string) => Promise<{ token: string }>
}
