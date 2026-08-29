import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addInstructorType,
  editInstructorType,
  getInstructorTypes,
  removeInstructorType,
} from "./instructorType.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getInstructorTypes);
router.post("/", addInstructorType);
router.patch("/:id", editInstructorType);
router.delete("/:id", removeInstructorType);

export default router;
