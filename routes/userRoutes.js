import { verifyToken } from '../middlewares/tokenVerify.js'
import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

// Devuelve todos los nombres de los usuarios existentes
router.get('/', verifyToken, userController.getAll)

// Devuelve un solo usuario por su nombre completo
router.get('/:fullname', userController.getOneByFullName)

// Registro de usuario
router.post('/register', userController.addOne)

// Login de usuario
router.post('/login', userController.login)

// Logout del usuario
router.post('/logout', userController.logout)

export default router
