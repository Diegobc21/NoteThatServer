import mongoose from 'mongoose'

const softwareSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  categorias: {
    type: {
      posicionPrincipal: {
        type: Number,
        required: true
      },
      listado: {
        type: [String],
        required: true
      }
    },
    required: true
  },
  descarga: {
    type: String,
    required: true
  },
  winget_id: {
    type: String,
    required: true
  },
  extras: [
    {
      titulo: {
        type: String,
        required: true
      },
      fuente: {
        type: String,
        required: true
      }
    }
  ],
  iconURL: {
    type: String,
    required: true
  }
})

/**
 * softwareItem: nombre del modelo
 * softwareSchema: esquema del modelo
 * software: nombre de la colección en la base de datos
 */
export default mongoose.model('softwareItem', softwareSchema, 'software')
