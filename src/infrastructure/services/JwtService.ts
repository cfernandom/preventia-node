import { injectable } from 'tsyringe'
import jwt, { JsonWebTokenError, SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { IJwtService, JwtPayload } from '../../domain/services/IJwtService'
import { config } from '../../config/env'
import { AuthenticationError } from '../../common/errors'

@injectable()
export class JwtService implements IJwtService {
  private readonly options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: config.jwt.expiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience
  }

  sign (payload: JwtPayload): string {
    try {
      return jwt.sign(payload, config.jwt.secret, this.options)
    } catch (error) {
      throw new AuthenticationError(
        'token_generation_failed',
        {
          // error_name: error.name,
          payload_keys: Object.keys(payload)
        }
      )
    }
  }

  verify<T extends JwtPayload> (token: string): T {
    try {
      const decoded = jwt.verify(token, config.jwt.secret, this.options)
      return decoded as T
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AuthenticationError('token_expired',
          {
            expiredAt: error.expiredAt.toISOString(),
            token: token.slice(0, 10) + '...'
          }
        )
      }
      if (error instanceof JsonWebTokenError) {
        throw new AuthenticationError(
          'invalid_token_signature',
          {
            token: token.slice(0, 10) + '...',
            error_message: error.message
          }
        )
      }
      throw new AuthenticationError(
        'token_verification_failed',
        {
          // original_error: error.name,
          token_type: typeof token
        }
      )
    }
  }
}
