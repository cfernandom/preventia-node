import express from 'express'

import { container } from 'tsyringe'
import { JwtService } from './infrastructure/services/JwtService'
import authRoutes from './interfaces/http/routes/v1/auth.routes'
import { jwtAuthMiddleware } from './common/middleware/auth.middleware'
import { errorHandler } from './common/middleware/error.middleware'
import healthRoutes from './interfaces/http/routes/v1/health.routes'
import userRoutes from './interfaces/http/routes/v1/user.routes'

// Inicilizacion de express
export const app = express()

// Resolución de dependencias
const jwtService = container.resolve(JwtService)

// Middlewares base
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check
app.use('/api/v1/health', healthRoutes)

// Rutas públicas
app.use('/api/v1/auth', authRoutes)

// Middleware de autenticación JWT
app.use('/api/v1', jwtAuthMiddleware(jwtService))

// Rutas protegidas
app.use('/api/v1/users', userRoutes)

// Manejo centralizado de errores (DEBE ser el último middleware)
app.use(errorHandler)
