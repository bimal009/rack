import { Request, Response } from "express";
import { gymFeatureListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createFeature,
  deleteFeature,
  listFeatures,
  updateFeature,
} from "./feature.service";

export const getFeatures = async (req: Request, res: Response) => {
  try {
    const query = gymFeatureListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listFeatures(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Features fetched"));
  } catch (error) {
    const { status, body } = handleError("getFeatures", error);
    return res.status(status).json(body);
  }
};

export const addFeature = async (req: Request, res: Response) => {
  try {
    const record = await createFeature(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Feature added"));
  } catch (error) {
    const { status, body } = handleError("addFeature", error);
    return res.status(status).json(body);
  }
};

export const editFeature = async (req: Request, res: Response) => {
  try {
    const record = await updateFeature(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Feature updated"));
  } catch (error) {
    const { status, body } = handleError("editFeature", error);
    return res.status(status).json(body);
  }
};

export const removeFeature = async (req: Request, res: Response) => {
  try {
    const record = await deleteFeature(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Feature removed"));
  } catch (error) {
    const { status, body } = handleError("removeFeature", error);
    return res.status(status).json(body);
  }
};
