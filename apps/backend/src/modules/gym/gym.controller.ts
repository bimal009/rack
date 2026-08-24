import { Request, Response } from "express";
import { UnauthorizedError, handleError, ConflictError } from "../../lib/errors";
import { onboardGym } from "./gym.service";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";

export const createGym = async (req: Request, res: Response) => {
  try {
    const user=req.user
    if (!user) throw new UnauthorizedError("Unauthorized access");

    if (user.onboarded) {
      throw new ConflictError("You are already onboarded");
    }

    const gymRecord = await onboardGym(req.body, user.id);

    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(gymRecord, "Gym Created Successfully"));
  } catch (error) {
    const { status, body } = handleError("createGym", error);
    return res.status(status).json(body);
  }
};