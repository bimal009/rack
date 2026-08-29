import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import { addBrand, editBrand, getBrands, removeBrand } from "./brand.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getBrands);
router.post("/", addBrand);
router.patch("/:id", editBrand);
router.delete("/:id", removeBrand);

export default router;
