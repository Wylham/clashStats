import { Router } from "express";
import { getClanController, createClanController } from "../controllers/clanController";

const router = Router();

router.post("/clan", createClanController);
router.get("/clan/:tag", getClanController);

export default router;
