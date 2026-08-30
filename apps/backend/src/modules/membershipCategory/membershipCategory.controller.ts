import { Request, Response } from "express";
import { planCategoryListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createPlanCategory,
  deletePlanCategory,
  listPlanCategories,
  updatePlanCategory,
} from "./planCategory.service";

export const getPlanCategories = async (req: Request, res: Response) => {
  try {
    const query = planCategoryListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listPlanCategories(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Plan categories fetched"));
  } catch (error) {
    const { status, body } = handleError("getPlanCategories", error);
    return res.status(status).json(body);
  }
};

export const addPlanCategory = async (req: Request, res: Response) => {
  try {
    const record = await createPlanCategory(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Plan category created"));
  } catch (error) {
    const { status, body } = handleError("addPlanCategory", error);
    return res.status(status).json(body);
  }
};

export const editPlanCategory = async (req: Request, res: Response) => {
  try {
    const record = await updatePlanCategory(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Plan category updated"));
  } catch (error) {
    const { status, body } = handleError("editPlanCategory", error);
    return res.status(status).json(body);
  }
};

export const removePlanCategory = async (req: Request, res: Response) => {
  try {
    const record = await deletePlanCategory(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Plan category removed"));
  } catch (error) {
    const { status, body } = handleError("removePlanCategory", error);
    return res.status(status).json(body);
  }
};
