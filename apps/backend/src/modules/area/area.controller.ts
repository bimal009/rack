import { Request, Response } from "express";
import { areaListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import { createArea, deleteArea, listAreas, updateArea } from "./area.service";

export const getAreas = async (req: Request, res: Response) => {
  try {
    const query = areaListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listAreas(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Areas fetched"));
  } catch (error) {
    const { status, body } = handleError("getAreas", error);
    return res.status(status).json(body);
  }
};

export const addArea = async (req: Request, res: Response) => {
  try {
    const record = await createArea(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Area created"));
  } catch (error) {
    const { status, body } = handleError("addArea", error);
    return res.status(status).json(body);
  }
};

export const editArea = async (req: Request, res: Response) => {
  try {
    const record = await updateArea(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Area updated"));
  } catch (error) {
    const { status, body } = handleError("editArea", error);
    return res.status(status).json(body);
  }
};

export const removeArea = async (req: Request, res: Response) => {
  try {
    const record = await deleteArea(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Area removed"));
  } catch (error) {
    const { status, body } = handleError("removeArea", error);
    return res.status(status).json(body);
  }
};
