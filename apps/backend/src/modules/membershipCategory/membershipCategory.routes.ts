import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addMembershipCategory,
  editMembershipCategory,
  getMembershipCategories,
  removeMembershipCategory,
} from "./membershipCategory.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getMembershipCategories);
router.post("/", addMembershipCategory);
router.patch("/:id", editMembershipCategory);
router.delete("/:id", removeMembershipCategory);

export default router;
