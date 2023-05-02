import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

// Devuelve todos los nombres de los usuarios existentes
router.get('/', userController.getAll)
// Devuelve un solo usuario por su nombre completo
router.get('/:fullname', userController.getOne)

// Devuelve todos los nombres de los usuarios existentes
router.post('/', userController.addOne)
export default router
