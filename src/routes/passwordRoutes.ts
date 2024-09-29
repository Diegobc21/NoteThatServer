import { Router } from "express";
import {
  getAllPasswords,
  getCensoredPasswordsBySection,
  getUncensoredPassword,
  addPassword,
  addSection,
  editSection,
  getUserSections,
  deletePasswordById,
  removeSection,
  makePasswordsVisible,
  editPassword
} from "../controllers/passwordController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/", verifyToken, getAllPasswords);

router.get("/:section", verifyToken, getCensoredPasswordsBySection);

router.get("/section/:user", verifyToken, getUserSections);

router.post("/uncensored/:id", verifyToken, getUncensoredPassword);

router.post("/", verifyToken, addPassword);

router.post("/make-visible", verifyToken, makePasswordsVisible);

router.post("/section", verifyToken, addSection);

router.put("/password", verifyToken, editPassword);

router.put("/section", verifyToken, editSection);

router.delete("/:id", verifyToken, deletePasswordById);

router.delete("/section/:id", verifyToken, removeSection);

export default router;
