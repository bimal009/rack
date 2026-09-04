import { Request, Response } from "express";
import { gymPlanListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createGymPlan,
  deleteGymPlan,
  getGymPlan,
  listGymPlans,
  updateGymPlan,
} from "./gymPlan.service";

export const getGymPlans = async (req: Request, res: Response) => {
  try {
    const query = gymPlanListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listGymPlans(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Plans fetched"));
  } catch (error) {
    const { status, body } = handleError("getGymPlans", error);
    return res.status(status).json(body);
  }
};

export const getGymPlanById = async (req: Request, res: Response) => {
  try {
    const record = await getGymPlan(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Plan fetched"));
  } catch (error) {
    const { status, body } = handleError("getGymPlanById", error);
    return res.status(status).json(body);
  }
};

export const addGymPlan = async (req: Request, res: Response) => {
  try {
    const record = await createGymPlan(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Plan created"));
  } catch (error) {
    const { status, body } = handleError("addGymPlan", error);
    return res.status(status).json(body);
  }
};

export const editGymPlan = async (req: Request, res: Response) => {
  try {
    const record = await updateGymPlan(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Plan updated"));
  } catch (error) {
    const { status, body } = handleError("editGymPlan", error);
    return res.status(status).json(body);
  }
};

export const removeGymPlan = async (req: Request, res: Response) => {
  try {
    const record = await deleteGymPlan(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Plan removed"));
  } catch (error) {
    const { status, body } = handleError("removeGymPlan", error);
    return res.status(status).json(body);
  }
};
