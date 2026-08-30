import { Request, Response } from "express";
import { payRateListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createPayRate,
  deletePayRate,
  listPayRates,
  updatePayRate,
} from "./payRate.service";

export const getPayRates = async (req: Request, res: Response) => {
  try {
    const query = payRateListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listPayRates(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Pay rates fetched"));
  } catch (error) {
    const { status, body } = handleError("getPayRates", error);
    return res.status(status).json(body);
  }
};

export const addPayRate = async (req: Request, res: Response) => {
  try {
    const record = await createPayRate(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Pay rate created"));
  } catch (error) {
    const { status, body } = handleError("addPayRate", error);
    return res.status(status).json(body);
  }
};

export const editPayRate = async (req: Request, res: Response) => {
  try {
    const record = await updatePayRate(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Pay rate updated"));
  } catch (error) {
    const { status, body } = handleError("editPayRate", error);
    return res.status(status).json(body);
  }
};

export const removePayRate = async (req: Request, res: Response) => {
  try {
    const record = await deletePayRate(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Pay rate removed"));
  } catch (error) {
    const { status, body } = handleError("removePayRate", error);
    return res.status(status).json(body);
  }
};
