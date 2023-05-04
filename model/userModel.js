import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: [String],
    required: false
  }
}, { versionKey: false })

/**
 * userItem: nombre del modelo
 * userSchema: esquema del modelo
 * user: nombre de la colección en la base de datos
 */
export default mongoose.model('userItem', userSchema, 'user')
