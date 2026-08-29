import { Request, Response } from "express";
import { areaTypeListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createAreaType,
  deleteAreaType,
  listAreaTypes,
  updateAreaType,
} from "./areaType.service";

export const getAreaTypes = async (req: Request, res: Response) => {
  try {
    const query = areaTypeListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listAreaTypes(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Area types fetched"));
  } catch (error) {
    const { status, body } = handleError("getAreaTypes", error);
    return res.status(status).json(body);
  }
};

export const addAreaType = async (req: Request, res: Response) => {
  try {
    const record = await createAreaType(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Area type created"));
  } catch (error) {
    const { status, body } = handleError("addAreaType", error);
    return res.status(status).json(body);
  }
};

export const editAreaType = async (req: Request, res: Response) => {
  try {
    const record = await updateAreaType(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Area type updated"));
  } catch (error) {
    const { status, body } = handleError("editAreaType", error);
    return res.status(status).json(body);
  }
};

export const removeAreaType = async (req: Request, res: Response) => {
  try {
    const record = await deleteAreaType(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Area type removed"));
  } catch (error) {
    const { status, body } = handleError("removeAreaType", error);
    return res.status(status).json(body);
  }
};
