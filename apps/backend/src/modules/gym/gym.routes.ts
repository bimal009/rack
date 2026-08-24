import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { createGym } from "./gym.controller";

const router:Router = Router();

router.post("/", requireAuth, createGym);

export default router;
