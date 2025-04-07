export type ErrorDetails = Record<string, unknown> | null

export class ApplicationError extends Error {
  constructor (
    public readonly code: string,
    public readonly userMessage?: string,
    public readonly statusCode: number = 500,
    public readonly details: ErrorDetails = null
  ) {
    super(userMessage)
    Object.setPrototypeOf(this, new.target.prototype)
  }

  // Formato estándar para respuestas HTTP
  toResponse (): Record<string, unknown> {
    return {
      error: {
        code: this.code,
        message: this.userMessage ?? 'An unexpected error occurred',
        details: this.details,
        timestamp: new Date().toISOString()
      }
    }
  }
}

export class NotFoundError extends ApplicationError {
  constructor (resource: string, id?: string) {
    super(
      'NOT_FOUND',
      'Recurso no encontrado',
      404,
      { details: `Resource ${resource}${id != null && id !== '' ? ` with ID ${id}` : ''} not found` }
    )
  }
}

export class ValidationError extends ApplicationError {
  constructor (
    userMessage: string,
    details?: object
  ) {
    super(
      'VALIDATION_FAILED',
      userMessage,
      400,
      { ...details }
    )
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor (action: string) {
    super(
      'UNAUTHORIZED_ACTION',
      'No tienes permiso para realizar esta acción',
      401,
      { action }
    )
  }
}

type AuthErrorReason =
  | 'account_locked'
  | 'invalid_credentials'
  | 'invalid_token_format'
  | 'invalid_token_signature'
  | 'invalid_token'
  | 'missing_authorization_header'
  | 'token_expired'
  | 'token_generation_failed'
  | 'token_verification_failed'
  | 'unknown_auth_error'

export class AuthenticationError extends ApplicationError {
  constructor (reason: AuthErrorReason, details?: ErrorDetails) {
    const errorConfig = {
      invalid_credentials: {
        code: 'INVALID_CREDENTIALS',
        userMessage: 'Email o contraseña incorrectos'
      },
      token_expired: {
        code: 'TOKEN_EXPIRED',
        userMessage: 'Sesión expirada, inicia sesión nuevamente'
      },
      invalid_token: {
        code: 'INVALID_TOKEN',
        userMessage: 'Token de autenticación inválido'
      },
      invalid_token_format: {
        code: 'INVALID_TOKEN_FORMAT',
        userMessage: 'Formato de token inválido'
      },
      missing_authorization_header: {
        code: 'MISSING_AUTHORIZATION_HEADER',
        userMessage: 'Falta el encabezado de autorización'
      },
      invalid_token_signature: {
        code: 'INVALID_TOKEN_SIGNATURE',
        userMessage: 'Firma de token inválida'
      },
      account_locked: {
        code: 'ACCOUNT_LOCKED',
        userMessage: 'Cuenta bloqueada'
      },
      token_generation_failed: {
        code: 'TOKEN_GENERATION_FAILED',
        userMessage: 'Error al generar el token'
      },
      token_verification_failed: {
        code: 'TOKEN_VERIFICATION_FAILED',
        userMessage: 'Error al verificar el token'
      },
      unknown_auth_error: {
        code: 'UNKNOWN_AUTH_ERROR',
        userMessage: 'Error desconocido durante la autenticación'
      }
    }[reason]

    super(
      errorConfig.code,
      errorConfig.userMessage,
      401,
      { reason: `Authentication error: ${reason}`, ...details } // Metadatos adicionales
    )
  }
}
