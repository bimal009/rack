import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { createGym, getMyGym, updateMyGym } from "./gym.controller";

const router:Router = Router();

router.post("/", requireAuth, createGym);
router.get("/me", requireAuth, getMyGym);
router.put("/", requireAuth, updateMyGym);

export default router;
