import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  createMember,
  editMember,
  getMember,
  getMembers,
  removeMember,
} from "./member.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.post("/", createMember);
router.get("/", getMembers);
router.get("/:id", getMember);
router.patch("/:id", editMember);
router.delete("/:id", removeMember);

export default router;
