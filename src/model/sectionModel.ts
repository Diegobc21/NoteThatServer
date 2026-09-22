import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
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
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: true },
  }
);

sectionSchema.index({ user: 1, title: 1 });

/**
 * sectionItem: nombre del modelo
 * sectionSchema: esquema del modelo
 * section: nombre de la colección en la base de datos
 */
export default mongoose.model("sectionItem", sectionSchema, "section");
