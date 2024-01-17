import { Router } from "express";
import {
  getAllPasswords,
  getPasswordsBySection,
  addPassword,
  addSection,
  getUserSections
} from "../controllers/passwordController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/", verifyToken, getAllPasswords);

router.get("/:section", verifyToken, getPasswordsBySection);

router.get("/section/:user", verifyToken, getUserSections);

router.post("/newSection", verifyToken, addSection);

router.post("/", verifyToken, addPassword);

export default router;