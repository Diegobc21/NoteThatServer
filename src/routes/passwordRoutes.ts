import { Router } from "express";
import {
  getAllPasswords,
  getPasswordsBySection,
  addPassword,
  addSection,
  editSection,
  getUserSections,
  deletePasswordById,
  removeSection,
  makePasswordsVisible
} from "../controllers/passwordController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/", verifyToken, getAllPasswords);

router.get("/:section", verifyToken, getPasswordsBySection);

router.get("/section/:user", verifyToken, getUserSections);

router.post("/", verifyToken, addPassword);

router.post("/make-visible", verifyToken, makePasswordsVisible);

router.post("/section", verifyToken, addSection);

router.put("/section", verifyToken, editSection);

router.delete("/:id", verifyToken, deletePasswordById);

router.delete("/section/:id", verifyToken, removeSection);

export default router;
