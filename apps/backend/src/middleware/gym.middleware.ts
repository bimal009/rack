import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../lib/errors";
import { getGymById } from "../modules/gym/gym.service";

export const validateGym = async (req: Request, _res: Response, next: NextFunction) => {
  const gymId = req.params.gymId;
  if (typeof gymId !== "string" || gymId.length === 0) {
    throw new BadRequestError("Gym ID is required");
  }

  const gym = await getGymById(gymId);
  if (!gym) {
    throw new NotFoundError("Gym not found");
  }

  req.gym = gym;
  next();
};
