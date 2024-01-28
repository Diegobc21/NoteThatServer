import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    creationDate: {
      type: String,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

/**
 * passItem: nombre del modelo
 * passwordSchema: esquema del modelo
 * password: nombre de la colección en la base de datos
 */
export default mongoose.model("passItem", passwordSchema, "password");
