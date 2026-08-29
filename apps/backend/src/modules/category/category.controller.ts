import { Request, Response } from "express";
import { handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "./category.service";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const data = await listCategories(gymId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(data, "Categories fetched"));
  } catch (error) {
    const { status, body } = handleError("getCategories", error);
    return res.status(status).json(body);
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const record = await createCategory(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Category created"));
  } catch (error) {
    const { status, body } = handleError("addCategory", error);
    return res.status(status).json(body);
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const record = await updateCategory(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Category updated"));
  } catch (error) {
    const { status, body } = handleError("editCategory", error);
    return res.status(status).json(body);
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    const record = await deleteCategory(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Category removed"));
  } catch (error) {
    const { status, body } = handleError("removeCategory", error);
    return res.status(status).json(body);
  }
};
