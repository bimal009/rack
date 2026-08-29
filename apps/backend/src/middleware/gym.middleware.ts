import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../lib/errors";
import { getGymBySlug } from "../modules/gym/gym.service";

export const validateGym = async (req: Request, _res: Response, next: NextFunction) => {
  const slug = req.params.slug;
  if (typeof slug !== "string" || slug.length === 0) {
    throw new BadRequestError("Gym slug is required");
  }

  const gym = await getGymBySlug(slug);
  if (!gym) {
    throw new NotFoundError("Gym not found");
  }

  req.gym = gym;
  next();
};
