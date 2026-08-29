import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addCategory,
  editCategory,
  getCategories,
  removeCategory,
} from "./category.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getCategories);
router.post("/", addCategory);
router.patch("/:id", editCategory);
router.delete("/:id", removeCategory);

export default router;
