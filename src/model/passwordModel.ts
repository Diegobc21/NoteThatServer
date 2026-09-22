import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    user: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
    creationDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: true },
  }
);

passwordSchema.index({ user: 1, section: 1, creationDate: -1 });

/**
 * passItem: nombre del modelo
 * passwordSchema: esquema del modelo
 * password: nombre de la colección en la base de datos
 */
export default mongoose.model("passItem", passwordSchema, "password");
