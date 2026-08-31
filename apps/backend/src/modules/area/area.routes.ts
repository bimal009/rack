import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import { addArea, editArea, getAreas, removeArea } from "./area.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getAreas);
router.post("/", addArea);
router.patch("/:id", editArea);
router.delete("/:id", removeArea);

export default router;
