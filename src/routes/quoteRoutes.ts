import quoteController from '../controllers/quoteController.js'
import { Router } from "express"

const router = Router()

router.get('/', quoteController.getTodaysQuote)


export default router
