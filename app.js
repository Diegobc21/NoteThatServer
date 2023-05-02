import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import corsOptions from './middlewares/cors.js'
import database from './config/db.js'

database.connect()
dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(corsOptions)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('', (req, res) => {
  res.send('NoteThat back-end')
})

app.use('/user', userRoutes)

app.listen(port, () => {
  console.log(`Servidor funcionando en puerto ${port}`)
})
