import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { getImageKitAuth } from "./media.controller";

const router: Router = Router();

router.get("/imagekit/auth", requireAuth, getImageKitAuth);

export default router;
