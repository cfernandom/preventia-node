/**
 * Payload estándar para tokens JWT en la aplicación.
 * @property sub - ID único del usuario (UUID).
 * @property role - Rol del usuario (opcional).
 * @property email - Correo electrónico del usuario (opcional).
 * @property name - Nombre completo del usuario (opcional).
 */
export interface JwtPayload {
  sub: string
  role?: string
  email?: string
  name?: string
}

export interface IJwtService {
  sign: (payload: JwtPayload) => string
  verify: <T extends JwtPayload>(token: string) => T
}
