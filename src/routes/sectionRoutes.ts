import { Router } from "express";
import {
  addSection,
  editSection,
  getUserSections,
  removeSection,
} from "../controllers/sectionController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/:email", verifyToken, getUserSections);

router.post("/", verifyToken, addSection);

router.put("/", verifyToken, editSection);

router.delete("/:id", verifyToken, removeSection);

export default router;
