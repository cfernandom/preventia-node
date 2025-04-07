/**
 * Express Middleware for Zod Schema Validation
 *
 * @module middleware/validation
 * @description Generic middleware for validating Express request bodies against Zod schemas.
 *              Provides structured error responses for invalid requests.
 *
 * @example
 * // Usage in route definition
 * router.post('/users',
 *   validateRequest(UserSchema),
 *   userController.createUser
 * );
 */

import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * Zod Validation Middleware Factory
 * @function validateRequest
 * @param {z.ZodSchema} schema - Zod schema to validate against request body
 * @returns {function} Express middleware handler
 *
 * @throws {z.ZodError} When validation fails (handled internally)
 * @throws {Error} Propagates non-Zod errors to Express error handler
 *
 * @response 400 Bad Request
 * @body {Object} Validation error details
 * @body {string} message - "Invalid request data"
 * @body {Object[]} error - Error list
 * @body {string} error[].field - Dot-notation path to invalid field
 * @body {string} error[].message - Human-readable error message
 */
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        res.status(400).json({
          message: 'Invalid request data',
          error: formattedErrors
        })
        return
      }
      next(error)
    }
  }
}
