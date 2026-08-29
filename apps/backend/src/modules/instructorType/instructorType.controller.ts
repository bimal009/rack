import { Request, Response } from "express";
import { handleError } from "../../lib/errors";
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
    const data = await listInstructorTypes(gymId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(data, "Instructor types fetched"));
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
