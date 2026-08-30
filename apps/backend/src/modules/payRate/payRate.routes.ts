import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addPayRate,
  editPayRate,
  getPayRates,
  removePayRate,
} from "./payRate.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getPayRates);
router.post("/", addPayRate);
router.patch("/:id", editPayRate);
router.delete("/:id", removePayRate);

export default router;
