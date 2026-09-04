import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addMembershipPlan,
  editMembershipPlan,
  getMembershipPlanById,
  getMembershipPlans,
  removeMembershipPlan,
} from "./membershipPlan.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getMembershipPlans);
router.post("/", addMembershipPlan);
router.get("/:id", getMembershipPlanById);
router.patch("/:id", editMembershipPlan);
router.delete("/:id", removeMembershipPlan);

export default router;
