import { Router } from "express";
import { getAllPlans } from "./plans.controller";

const router: Router = Router();

router.get("/", getAllPlans);

export default router;
