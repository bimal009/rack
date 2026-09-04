import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  editGymOperatingHours,
  getGymOperatingHours,
} from "./gymOperatingHours.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getGymOperatingHours);
router.patch("/", editGymOperatingHours);

export default router;
