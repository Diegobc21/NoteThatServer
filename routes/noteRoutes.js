import express from 'express'
import noteController from '../controllers/noteController.js'
import { verifyToken } from '../middlewares/tokenVerify.js'

const router = express.Router()

// Devuelve todas las notas existentes por email de usuario
router.get('/', verifyToken, noteController.getNotesByUserEmail)

router.post('/', verifyToken, noteController.addOne)

export default router
