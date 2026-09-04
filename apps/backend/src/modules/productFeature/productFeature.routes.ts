import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addProductFeature,
  editProductFeature,
  getProductFeatures,
  removeProductFeature,
} from "./productFeature.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getProductFeatures);
router.post("/", addProductFeature);
router.patch("/:id", editProductFeature);
router.delete("/:id", removeProductFeature);

export default router;
