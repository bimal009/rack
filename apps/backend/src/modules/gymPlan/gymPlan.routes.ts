import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addGymPlan,
  editGymPlan,
  getGymPlanById,
  getGymPlans,
  removeGymPlan,
} from "./gymPlan.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getGymPlans);
router.post("/", addGymPlan);
router.get("/:id", getGymPlanById);
router.patch("/:id", editGymPlan);
router.delete("/:id", removeGymPlan);

export default router;
