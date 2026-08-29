import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addTaxRate,
  editTaxRate,
  getTaxRates,
  removeTaxRate,
} from "./taxRate.controller";

const router: Router = Router({ mergeParams: true });

router.use(requireAuth, validateGym, validateGymMember);

router.get("/", getTaxRates);
router.post("/", addTaxRate);
router.patch("/:id", editTaxRate);
router.delete("/:id", removeTaxRate);

export default router;
