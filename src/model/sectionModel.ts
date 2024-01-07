import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
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
 * sectionItem: nombre del modelo
 * sectionSchema: esquema del modelo
 * section: nombre de la colección en la base de datos
 */
export default mongoose.model("sectionItem", sectionSchema, "section");
