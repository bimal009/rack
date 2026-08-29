import { Request, Response } from "express";
import { brandListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createBrand,
  deleteBrand,
  listBrands,
  updateBrand,
} from "./brand.service";

export const getBrands = async (req: Request, res: Response) => {
  try {
    const query = brandListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listBrands(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Brands fetched"));
  } catch (error) {
    const { status, body } = handleError("getBrands", error);
    return res.status(status).json(body);
  }
};

export const addBrand = async (req: Request, res: Response) => {
  try {
    const record = await createBrand(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Brand created"));
  } catch (error) {
    const { status, body } = handleError("addBrand", error);
    return res.status(status).json(body);
  }
};

export const editBrand = async (req: Request, res: Response) => {
  try {
    const record = await updateBrand(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Brand updated"));
  } catch (error) {
    const { status, body } = handleError("editBrand", error);
    return res.status(status).json(body);
  }
};

export const removeBrand = async (req: Request, res: Response) => {
  try {
    const record = await deleteBrand(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Brand removed"));
  } catch (error) {
    const { status, body } = handleError("removeBrand", error);
    return res.status(status).json(body);
  }
};
