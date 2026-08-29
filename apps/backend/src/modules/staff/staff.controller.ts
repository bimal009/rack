import { Request, Response } from "express";
import { staffPaginationSchema } from "@repo/types";
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

    const parsed = staffPaginationSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError("Invalid pagination params", parsed.error.flatten());
    }

    const { data, pagination } = await getAll(gym.id, parsed.data);

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, pagination, "Staff fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getStaff", error);
    return res.status(status).json(body);
  }
};
