import { Router } from "express";
import {
  getAllPasswords,
  getPasswordsBySection,
  addPassword,
  addSection,
  getUserSections,
  deletePasswordById,
  removeSection,
} from "../controllers/passwordController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/", verifyToken, getAllPasswords);

router.get("/:section", verifyToken, getPasswordsBySection);

router.get("/section/:user", verifyToken, getUserSections);

router.post("/", verifyToken, addPassword);

router.post("/section", verifyToken, addSection);

router.delete("/:id", verifyToken, deletePasswordById);

router.delete("/section/:id", verifyToken, removeSection);

export default router;
