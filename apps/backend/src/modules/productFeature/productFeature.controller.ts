import { Request, Response } from "express";
import { productFeatureListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createProductFeature,
  deleteProductFeature,
  listProductFeatures,
  updateProductFeature,
} from "./productFeature.service";

export const getProductFeatures = async (req: Request, res: Response) => {
  try {
    const query = productFeatureListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listProductFeatures(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Product features fetched"));
  } catch (error) {
    const { status, body } = handleError("getProductFeatures", error);
    return res.status(status).json(body);
  }
};

export const addProductFeature = async (req: Request, res: Response) => {
  try {
    const record = await createProductFeature(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Product feature added"));
  } catch (error) {
    const { status, body } = handleError("addProductFeature", error);
    return res.status(status).json(body);
  }
};

export const editProductFeature = async (req: Request, res: Response) => {
  try {
    const record = await updateProductFeature(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product feature updated"));
  } catch (error) {
    const { status, body } = handleError("editProductFeature", error);
    return res.status(status).json(body);
  }
};

export const removeProductFeature = async (req: Request, res: Response) => {
  try {
    const record = await deleteProductFeature(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product feature removed"));
  } catch (error) {
    const { status, body } = handleError("removeProductFeature", error);
    return res.status(status).json(body);
  }
};
