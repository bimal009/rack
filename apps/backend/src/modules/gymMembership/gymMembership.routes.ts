import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateGym } from "../../middleware/gym.middleware";
import { validateGymMember } from "../../middleware/staff.middleware";
import {
  addMembership,
  editMembership,
  extendMembership,
  getMembership,
  getMemberships,
} from "./gymMembership.controller";

export const gymMembershipRouter: Router = Router({ mergeParams: true });

gymMembershipRouter.use(requireAuth, validateGym, validateGymMember);

gymMembershipRouter.get("/", getMembership);
gymMembershipRouter.post("/", addMembership);
gymMembershipRouter.patch("/:id", editMembership);
gymMembershipRouter.post("/:id/extend", extendMembership);

export const gymMembershipListRouter: Router = Router({ mergeParams: true });

gymMembershipListRouter.use(requireAuth, validateGym, validateGymMember);
gymMembershipListRouter.get("/", getMemberships);

export default gymMembershipRouter;