import { NextFunction, Request, Response } from 'express'
import { IJwtService } from '../../domain/services/IJwtService'
import { AuthenticationError } from '../errors'

declare module 'express' {
  interface Request {
    user?: { id: string }
  }
}

export const jwtAuthMiddleware = (jwtService: IJwtService) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    // Verificar presencia del header
    if (authHeader === undefined) {
      return next(new AuthenticationError(
        'missing_authorization_header',
        { header: 'Authorization' }
      ))
    }

    // Verificar formato del header
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AuthenticationError(
        'invalid_token_format',
        { header_value: authHeader }
      ))
    }

    const token = authHeader.split(' ')[1]

    // Verificar presencia del token
    if (token === undefined || token === '') {
      return next(new AuthenticationError(
        'invalid_token',
        { token_value: token }
      ))
    }

    try {
      // Verificar validez del token
      const payload = jwtService.verify<{
        sub: string
      }>(token)

      // Validar el payload
      if (payload.sub === undefined) {
        return next(new AuthenticationError(
          'invalid_token',
          { missing_value: 'sub' }
        ))
      }
      // Adjuntar información del usuario al objeto de la solicitud
      req.user = {
        id: payload.sub
      }

      next()
    } catch (error) {
      if (error instanceof AuthenticationError) {
        next(error) // Preserva el error original
      } else {
        next(new AuthenticationError(
          'unknown_auth_error',
          { original_error: error }
        ))
      }
    }
  }
}
