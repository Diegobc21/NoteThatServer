import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    url: {
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
    creationDate: {
      type: String,
      default: Date.now(),
    }
  },
  { versionKey: false }
);

/**
 * passItem: nombre del modelo
 * passwordSchema: esquema del modelo
 * password: nombre de la colección en la base de datos
 */
export default mongoose.model("passItem", passwordSchema, "password");
