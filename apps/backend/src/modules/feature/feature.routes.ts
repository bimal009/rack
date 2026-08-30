import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addFeature,
  editFeature,
  getFeatures,
  removeFeature,
} from "./feature.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getFeatures);
router.post("/", addFeature);
router.patch("/:id", editFeature);
router.delete("/:id", removeFeature);

export default router;
