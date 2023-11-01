import noteController from '../controllers/noteController.js'
import { verifyToken } from '../middlewares/tokenVerify.js'
import express from 'express';

const router = express.Router()

router.get('/', verifyToken, noteController.getNotesByUserEmail)

router.post('/', verifyToken, noteController.addOne)

router.put('/:id', verifyToken, noteController.editNote)

router.delete('/:id', verifyToken, noteController.deleteNoteById);

export default router
