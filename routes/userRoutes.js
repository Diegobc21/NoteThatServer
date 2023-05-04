import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

// Devuelve todos los nombres de los usuarios existentes
router.get('/', userController.getAll)

// Devuelve un solo usuario por su email
// router.get('', userController.getOneByEmail)

// Devuelve un solo usuario por su nombre completo
router.get('/:fullname', userController.getOneByFullName)

// Login mediante email
router.post('/:email', userController.login)

// Devuelve todos los nombres de los usuarios existentes
router.post('/', userController.addOne)

// Devuelve todos los nombres de los usuarios existentes

export default router
