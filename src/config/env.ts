/**
 * JWT Configuration Module
 *
 * @module config/jwt
 * @description Centralized and validated configuration for JSON Web Token (JWT) implementation.
 *              Uses Zod schema validation to ensure type safety and enforce security best practices.
 *
 * @requires zod
 * @requires process.env.JWT_SECRET
 * @requires process.env.JWT_EXPIRES_IN
 * @requires process.env.JWT_ISSUER
 * @requires process.env.JWT_AUDIENCE
 */

import { z } from 'zod'

/**
 * JWT Configuration Schema
 * @constant {z.ZodObject} jwtSchema
 *
 * @property {string} secret - JWT signing secret (minimum 32 characters)
 * @property {number} expiresIn - Token expiration time in seconds (default: 3600s/1h)
 * @property {string} audience - Token audience claim (default: 'preventia-api')
 * @property {string} issuer - Token issuer claim (default: 'preventia-web')
 *
 * @throws {ZodError} During initialization if:
 * - Secret is missing or <32 chars
 * - ExpiresIn is not a valid number
 * - Environment variables have incorrect types
 */
const jwtSchema = z.object({
  secret: z.string().min(32, 'Secret must be at least 32 characters long'),
  expiresIn: z.number().default(3600),
  audience: z.string().default('preventia-api'),
  issuer: z.string().default('preventia-web')
})

/**
 * Validated JWT Configuration
 * @constant {Object} config
 *
 * @typedef {Object} JWTConfig
 * @property {string} secret - Validated JWT secret from environment
 * @property {number} expiresIn - Token expiration in seconds
 * @property {string} audience - Service audience identifier
 * @property {string} issuer - Service issuer identifier
 *
 * @example
 * // Access configuration values
 * const token = jwt.sign(payload, config.jwt.secret, {
 *   expiresIn: config.jwt.expiresIn,
 *   audience: config.jwt.audience,
 *   issuer: config.jwt.issuer
 * })
 */
export const config = {
  jwt: jwtSchema.parse({
    secret: process.env.JWT_SECRET,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE
  })
}
