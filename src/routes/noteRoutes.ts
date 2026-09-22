import noteController from "../controllers/noteController.js";
import { verifyToken } from "../middlewares/tokenVerify.js";
import { Router } from "express";

const router = Router();

router.get("/", verifyToken, noteController.getAll);

router.get("/:id", verifyToken, noteController.getOne);

router.post("/", verifyToken, noteController.addOne);
router.put("/:id", verifyToken, noteController.editNote);
router.delete("/:id", verifyToken, noteController.deleteNoteById);

export default router;
