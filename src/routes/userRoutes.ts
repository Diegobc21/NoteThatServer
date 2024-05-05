import {
    getAll,
    getOneByFullName,
    addOne,
    login
} from '../controllers/userController.js'
import { verifyToken } from '../middlewares/tokenVerify.js'
import express from 'express';

const router = express.Router()

// Devuelve todos los usuarios existentes o uno por su email
router.get('/', verifyToken, getAll)

// Devuelve un solo usuario por su nombre completo
router.get("/:fullname", verifyToken, getOneByFullName);

router.post('/register', addOne)

router.post('/login', login)

export default router
