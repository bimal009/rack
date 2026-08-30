import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addPlanCategory,
  editPlanCategory,
  getPlanCategories,
  removePlanCategory,
} from "./planCategory.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getPlanCategories);
router.post("/", addPlanCategory);
router.patch("/:id", editPlanCategory);
router.delete("/:id", removePlanCategory);

export default router;
