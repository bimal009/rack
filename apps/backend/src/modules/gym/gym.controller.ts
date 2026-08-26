import { Request, Response } from "express";
import { UnauthorizedError, handleError, ConflictError } from "../../lib/errors";
import { getGymByOwner, onboardGym, updateGym } from "./gym.service";
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

export const getMyGym = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) throw new UnauthorizedError("Unauthorized access");

    const gymRecord = await getGymByOwner(user.id);

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(gymRecord, "Gym fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getMyGym", error);
    return res.status(status).json(body);
  }
};

export const updateMyGym = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) throw new UnauthorizedError("Unauthorized access");

    const gymRecord = await updateGym(req.body, user.id);

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(gymRecord, "Gym updated successfully"));
  } catch (error) {
    const { status, body } = handleError("updateMyGym", error);
    return res.status(status).json(body);
  }
};
