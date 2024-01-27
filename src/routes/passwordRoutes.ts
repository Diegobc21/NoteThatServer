import { Router } from "express";
import {
  getAllPasswords,
  getPasswordsBySection,
  addPassword,
  addSection,
  getUserSections,
  deletePasswordById,
} from "../controllers/passwordController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/", verifyToken, getAllPasswords);

router.get("/:section", verifyToken, getPasswordsBySection);

router.get("/section/:user", verifyToken, getUserSections);

router.post("/section", verifyToken, addSection);

router.post("/", verifyToken, addPassword);

router.delete("/:id", verifyToken, deletePasswordById);

export default router;
