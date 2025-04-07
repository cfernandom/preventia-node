import { Router } from 'express'
import { AuthController } from '../../controllers/auth.controller'
import { container } from 'tsyringe'
import { validateRequest } from '../../../../common/middleware/validation.middleware'
import { LoginSchema, RegisterSchema } from '../../../../common/schemas/auth.schemas'

const router = Router()

const authController = container.resolve(AuthController)

router.post('/register', validateRequest(RegisterSchema), authController.register.bind(authController))
router.post('/login', validateRequest(LoginSchema), authController.login.bind(authController))

export default router
