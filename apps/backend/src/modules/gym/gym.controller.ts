import { Request, Response } from "express";
import { UnauthorizedError, handleError } from "../../lib/errors";
import { onboardGym } from "./gym.service";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";

export const createGym = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError("Unauthorized access");

    const gymRecord = await onboardGym(req.body, userId);

    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(gymRecord, "Gym Created Successfully"));
  } catch (error) {
    const { status, body } = handleError("createGym", error);
    return res.status(status).json(body);
  }
};