import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import { addSport, editSport, getSports, removeSport } from "./sport.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getSports);
router.post("/", addSport);
router.patch("/:id", editSport);
router.delete("/:id", removeSport);

export default router;
