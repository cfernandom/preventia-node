import { Router } from 'express'
import { UserController } from '../../controllers/user.controller'
import { container } from 'tsyringe'

const router = Router()

const userController = container.resolve(UserController)

router.get('/me', userController.getProfile.bind(userController))

export default router
