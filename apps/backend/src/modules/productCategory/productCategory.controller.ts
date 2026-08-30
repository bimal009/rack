import { Request, Response } from "express";
import { productCategoryListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createProductCategory,
  deleteProductCategory,
  listProductCategories,
  updateProductCategory,
} from "./productCategory.service";

export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const query = productCategoryListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listProductCategories(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Product categories fetched"));
  } catch (error) {
    const { status, body } = handleError("getProductCategories", error);
    return res.status(status).json(body);
  }
};

export const addProductCategory = async (req: Request, res: Response) => {
  try {
    const record = await createProductCategory(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Product category created"));
  } catch (error) {
    const { status, body } = handleError("addProductCategory", error);
    return res.status(status).json(body);
  }
};

export const editProductCategory = async (req: Request, res: Response) => {
  try {
    const record = await updateProductCategory(
      gymId(req),
      pathId(req),
      req.body
    );
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product category updated"));
  } catch (error) {
    const { status, body } = handleError("editProductCategory", error);
    return res.status(status).json(body);
  }
};

export const removeProductCategory = async (req: Request, res: Response) => {
  try {
    const record = await deleteProductCategory(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product category removed"));
  } catch (error) {
    const { status, body } = handleError("removeProductCategory", error);
    return res.status(status).json(body);
  }
};
