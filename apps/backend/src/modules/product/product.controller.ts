import { Request, Response } from "express";
import { productListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "./product.service";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = productListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listProducts(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Products fetched"));
  } catch (error) {
    const { status, body } = handleError("getProducts", error);
    return res.status(status).json(body);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const record = await getProduct(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product fetched"));
  } catch (error) {
    const { status, body } = handleError("getProductById", error);
    return res.status(status).json(body);
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const record = await createProduct(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Product created"));
  } catch (error) {
    const { status, body } = handleError("addProduct", error);
    return res.status(status).json(body);
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const record = await updateProduct(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product updated"));
  } catch (error) {
    const { status, body } = handleError("editProduct", error);
    return res.status(status).json(body);
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const record = await deleteProduct(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Product removed"));
  } catch (error) {
    const { status, body } = handleError("removeProduct", error);
    return res.status(status).json(body);
  }
};
