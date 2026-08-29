import { Request } from "express";
import { BadRequestError, ForbiddenError } from "./errors";

export function gymId(req: Request): string {
  if (!req.gym) {
    throw new ForbiddenError("Gym context is missing");
  }
  return req.gym.id;
}

export function pathId(req: Request, name = "id"): string {
  const value = req.params[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new BadRequestError(`${name} is required`);
  }
  return value;
}
