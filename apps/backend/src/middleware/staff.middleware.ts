import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";
import { getStaffByGym } from "../modules/staff/staff.service";

/**
 * Ensures the authenticated user is an active staff member of `req.gym`.
 * Requires `requireAuth` and `validateGym` to have run first.
 * Attaches the staff record as `req.staff`.
 */
export const validateGymMember = async (req: Request, _res: Response, next: NextFunction) => {
  const user = req.user;
  const gym = req.gym;

  if (!user) {
    throw new UnauthorizedError("Unauthorized access");
  }
  if (!gym) {
    throw new ForbiddenError("Gym context is missing");
  }

  const member = await getStaffByGym(gym.id, user.id);
  if (!member) {
    throw new ForbiddenError("You are not a member of this gym");
  }

  req.staff = member;
  next();
};
