import { Request, Response } from "express";
import { classTypeListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createClassType,
  deleteClassType,
  listClassTypes,
  updateClassType,
} from "./classType.service";

export const getClassTypes = async (req: Request, res: Response) => {
  try {
    const query = classTypeListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listClassTypes(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Class types fetched"));
  } catch (error) {
    const { status, body } = handleError("getClassTypes", error);
    return res.status(status).json(body);
  }
};

export const addClassType = async (req: Request, res: Response) => {
  try {
    const record = await createClassType(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Class type created"));
  } catch (error) {
    const { status, body } = handleError("addClassType", error);
    return res.status(status).json(body);
  }
};

export const editClassType = async (req: Request, res: Response) => {
  try {
    const record = await updateClassType(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Class type updated"));
  } catch (error) {
    const { status, body } = handleError("editClassType", error);
    return res.status(status).json(body);
  }
};

export const removeClassType = async (req: Request, res: Response) => {
  try {
    const record = await deleteClassType(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Class type removed"));
  } catch (error) {
    const { status, body } = handleError("removeClassType", error);
    return res.status(status).json(body);
  }
};
