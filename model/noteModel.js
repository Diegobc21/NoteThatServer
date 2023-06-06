import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
}, { versionKey: false })

/**
 * userItem: nombre del modelo
 * userSchema: esquema del modelo
 * user: nombre de la colección en la base de datos
 */
export default mongoose.model('noteItem', noteSchema, 'note')
