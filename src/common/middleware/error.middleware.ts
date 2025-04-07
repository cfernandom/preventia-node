/**
 * Express Global Error Handler Middleware
 *
 * @module middleware/errorHandler
 * @description Centralized error handling middleware for Express applications.
 *              Processes different error types and returns standardized JSON responses.
 *
 * @see {@link https://expressjs.com/en/guide/error-handling.html Express Error Handling}
 */

import { NextFunction, Request, Response } from 'express'
import logger from '../../infrastructure/logging/logger'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { ApplicationError, ValidationError } from '../errors'

/**
 * Global Error Handler
 * @function errorHandler
 * @param {unknown} error - Captured error object
 * @param {Request} _ - Express request object (unused)
 * @param {Response} res - Express response object
 * @param {NextFunction} __ - Express next function (unused)
 * @returns {Response} JSON response with error details
 *
 * @response 400 Bad Request - Zod validation errors
 * @response 4XX/5XX - Application-specific errors
 * @response 500 Internal Server Error - Unexpected errors
 *
 * @example
 * // Register in Express app
 * app.use(errorHandler)
 */
export const errorHandler = (
  error: unknown,
  _: Request,
  res: Response,
  __: NextFunction
): any => {
  // Log error details with contextual information
  logger.error('Error processing request:', error)
  if (error instanceof ApplicationError && process.env.NODE_ENV !== 'production') {
    logger.debug('Detalles del error de aplicación:', error.details)
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const validationError = fromZodError(error)
    const formattedError = new ValidationError(
      'Validation failed',
      {
        fields: validationError.message,
        details: error.issues.map(issue => ({
          path: issue.path.join('.'),
          code: issue.code,
          message: issue.message
        }))
      }
    )
    return res.status(formattedError.statusCode).json(formattedError.toResponse())
  }

  // Handle known application errors
  if (error instanceof ApplicationError) {
    // Debug logging for development environments
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('Error details:', error.details)
    }
    return res.status(error.statusCode).json(error.toResponse())
  }

  // Handle unexpected errors
  const isProduction = process.env.NODE_ENV === 'production'
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProduction
        ? 'An unexpected error occurred'
        : (error as Error)?.message ?? 'Unknown error',
      ...(!isProduction && {
        stack: (error as Error)?.stack,
        rawError: error
      }),
      timestamp: new Date().toISOString()
    }
  })
}
