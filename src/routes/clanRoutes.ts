import { Router } from "express";
import { getClanController } from "../controllers/clanController";

const router = Router();

router.get("/clan/:tag", getClanController);

export default router;
