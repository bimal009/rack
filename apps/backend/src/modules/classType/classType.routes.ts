import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addClassType,
  editClassType,
  getClassTypes,
  removeClassType,
} from "./classType.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getClassTypes);
router.post("/", addClassType);
router.patch("/:id", editClassType);
router.delete("/:id", removeClassType);

export default router;
