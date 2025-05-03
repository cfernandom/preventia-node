import { Router } from 'express'
import { UserController } from '../../controllers/user.controller'
import { container } from 'tsyringe'

const router = Router()

const userController = container.resolve(UserController)

router.get('/me', userController.getProfile.bind(userController))
router.put('/me', userController.updateUser.bind(userController))

router.get('/all', userController.allUser.bind(userController))

router.post('/email', userController.getUserByEmail.bind(userController))

router.get('/:id', userController.getUserById.bind(userController))

export default router
