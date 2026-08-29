import { Request, Response } from "express";
import { handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { get } from "./plans.service";

export const getAllPlans = async (_req: Request, res: Response) => {
  try {
    const plans = await get();

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(plans, "Plans fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getAllPlans", error);
    return res.status(status).json(body);
  }
};
