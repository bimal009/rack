import { Request, Response } from "express";
import { instructorTypeListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createInstructorType,
  deleteInstructorType,
  listInstructorTypes,
  updateInstructorType,
} from "./instructorType.service";

export const getInstructorTypes = async (req: Request, res: Response) => {
  try {
    const query = instructorTypeListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listInstructorTypes(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Instructor types fetched"));
  } catch (error) {
    const { status, body } = handleError("getInstructorTypes", error);
    return res.status(status).json(body);
  }
};

export const addInstructorType = async (req: Request, res: Response) => {
  try {
    const record = await createInstructorType(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Instructor type created"));
  } catch (error) {
    const { status, body } = handleError("addInstructorType", error);
    return res.status(status).json(body);
  }
};

export const editInstructorType = async (req: Request, res: Response) => {
  try {
    const record = await updateInstructorType(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Instructor type updated"));
  } catch (error) {
    const { status, body } = handleError("editInstructorType", error);
    return res.status(status).json(body);
  }
};

export const removeInstructorType = async (req: Request, res: Response) => {
  try {
    const record = await deleteInstructorType(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Instructor type removed"));
  } catch (error) {
    const { status, body } = handleError("removeInstructorType", error);
    return res.status(status).json(body);
  }
};
