import { Request, Response } from "express";
import { staffListQuerySchema } from "@repo/types";
import { ForbiddenError, ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { createStaffWithUser, getAll } from "./staff.service";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const gym = req.gym;
    if (!gym) throw new ForbiddenError("Gym context is missing");

    const staffRecord = await createStaffWithUser(req.body, gym.id);

    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(staffRecord, "Staff created successfully"));
  } catch (error) {
    const { status, body } = handleError("createStaff", error);
    return res.status(status).json(body);
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const gym = req.gym;
    if (!gym) throw new ForbiddenError("Gym context is missing");

    const query = staffListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await getAll(gym.id, query.data);

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Staff fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getStaff", error);
    return res.status(status).json(body);
  }
};
