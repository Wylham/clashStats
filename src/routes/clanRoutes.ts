import { Router } from "express";
import { getClanController, getClanMembersController, createClanController } from "../controllers/clanController";

const router = Router();

router.post("/clan", createClanController);
router.get("/clan/:tag/members", getClanMembersController);
router.get("/clan/:tag", getClanController);

export default router;
