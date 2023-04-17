import express from 'express'
import softwareController from './../controllers/softwareController.js'

const router = express.Router()

// Ruta con todos los métodos para obtener software por parámetros de consulta
router.get('/', softwareController.getAll)

// Obtener todas las categorías
router.get('/categories', softwareController.categories)

// Obtener software por nombre
router.get('/:name', softwareController.getOne)

export default router
