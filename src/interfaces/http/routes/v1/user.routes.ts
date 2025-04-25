import { Router } from 'express'
import { UserController } from '../../controllers/user.controller'
import { container } from 'tsyringe'

const router = Router()

const userController = container.resolve(UserController)

router.get('/me', userController.getProfile.bind(userController))
router.put('/me', userController.updateUser.bind(userController))

router.get('/allUser', userController.allUser.bind(userController))
router.post('/getUserByEmail', userController.getUserByEmail.bind(userController))
router.post('/getUserById', userController.getUserById.bind(userController))
export default router
