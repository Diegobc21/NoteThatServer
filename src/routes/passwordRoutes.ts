import { Router } from "express";
import {
  getCensoredPasswordsBySection,
  getUncensoredPasswordById,
  addPassword,
  deletePasswordById,
  makePasswordsVisible,
  editPassword
} from "../controllers/passwordController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.post("/bySection", verifyToken, getCensoredPasswordsBySection);

router.get("/uncensored/:id", verifyToken, getUncensoredPasswordById);

router.post("/", verifyToken, addPassword);

router.post("/make-visible", verifyToken, makePasswordsVisible);

router.put("/:id", verifyToken, editPassword);

router.delete("/:id", verifyToken, deletePasswordById);

export default router;
