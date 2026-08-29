import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addAreaType,
  editAreaType,
  getAreaTypes,
  removeAreaType,
} from "./areaType.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getAreaTypes);
router.post("/", addAreaType);
router.patch("/:id", editAreaType);
router.delete("/:id", removeAreaType);

export default router;
