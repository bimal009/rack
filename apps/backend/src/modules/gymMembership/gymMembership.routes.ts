import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addMembership,
  editMembership,
  extendMembership,
  getMembership,
} from "./gymMembership.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getMembership);
router.post("/", addMembership);
router.patch("/:id", editMembership);
router.post("/:id/extend", extendMembership);

export default router;
