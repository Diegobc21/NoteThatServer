import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      default: "",
      maxlength: 50_000,
    },
    // This field is kept for compatibility with existing notes and clients.
    creationDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    user: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: true },
  },
);

noteSchema.index({ user: 1, creationDate: -1 });

/**
 * userItem: nombre del modelo
 * userSchema: esquema del modelo
 * user: nombre de la colección en la base de datos
 */
export default mongoose.model('noteItem', noteSchema, 'note')
