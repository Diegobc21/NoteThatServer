import express from 'express'
import spotifyController from '../controllers/spotifyController.js'
import { verifyToken } from '../middlewares/tokenVerify.js'

const router = express.Router()

// Devuelve todos los usuarios existentes o uno por su email
router.get('/userTopFive', spotifyController.getTopTracks)

export default router
