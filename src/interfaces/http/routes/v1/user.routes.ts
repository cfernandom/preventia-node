import { Router } from 'express'
import { UserController } from '../../controllers/user.controller'
import { container } from 'tsyringe'

const router = Router()

const userController = container.resolve(UserController)

router.get('/me', userController.getProfile.bind(userController))
router.put('/me', userController.updateUser.bind(userController))
// paginar los usuarios max 20
// p1 p2 p3 p4 p5 p6 p7 p8 p9 p10
// quitar contraseña de la respuesta
router.get('/all', userController.allUser.bind(userController))
// email
router.post('/email', userController.getUserByEmail.bind(userController))
// pasar a get
// revisar rutas dinamicas
router.post('/id', userController.getUserById.bind(userController))

export default router
