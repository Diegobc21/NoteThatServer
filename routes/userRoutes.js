import express from 'express'
import userController from '../controllers/userController.js'
import { verifyToken } from '../middlewares/tokenVerify.js'

const router = express.Router()

// Devuelve todos los usuarios existentes o uno por su email
router.get('/', verifyToken, userController.getAll)

// Devuelve un solo usuario por su nombre completo
router.get('/:fullname', userController.getOneByFullName)

router.post('/register', userController.addOne)

router.post('/login', userController.login)

export default router
