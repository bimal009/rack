import { Request, Response } from "express";
import { handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createTaxRate,
  deleteTaxRate,
  listTaxRates,
  updateTaxRate,
} from "./taxRate.service";

export const getTaxRates = async (req: Request, res: Response) => {
  try {
    const data = await listTaxRates(gymId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(data, "Tax rates fetched"));
  } catch (error) {
    const { status, body } = handleError("getTaxRates", error);
    return res.status(status).json(body);
  }
};

export const addTaxRate = async (req: Request, res: Response) => {
  try {
    const record = await createTaxRate(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Tax rate created"));
  } catch (error) {
    const { status, body } = handleError("addTaxRate", error);
    return res.status(status).json(body);
  }
};

export const editTaxRate = async (req: Request, res: Response) => {
  try {
    const record = await updateTaxRate(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Tax rate updated"));
  } catch (error) {
    const { status, body } = handleError("editTaxRate", error);
    return res.status(status).json(body);
  }
};

export const removeTaxRate = async (req: Request, res: Response) => {
  try {
    const record = await deleteTaxRate(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Tax rate removed"));
  } catch (error) {
    const { status, body } = handleError("removeTaxRate", error);
    return res.status(status).json(body);
  }
};
