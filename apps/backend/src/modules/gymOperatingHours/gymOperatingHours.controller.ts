import { Request, Response } from "express";
import { handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId } from "../../lib/helper";
import { getOperatingHours, updateOperatingHours } from "./gymOperatingHours.service";

export const getGymOperatingHours = async (req: Request, res: Response) => {
  try {
    const hours = await getOperatingHours(gymId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(hours, "Operating hours fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getGymOperatingHours", error);
    return res.status(status).json(body);
  }
};

export const editGymOperatingHours = async (req: Request, res: Response) => {
  try {
    const hours = await updateOperatingHours(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(hours, "Operating hours updated successfully"));
  } catch (error) {
    const { status, body } = handleError("editGymOperatingHours", error);
    return res.status(status).json(body);
  }
};
