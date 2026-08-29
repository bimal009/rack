import { Request, Response } from "express";
import { handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createSport,
  deleteSport,
  listSports,
  updateSport,
} from "./sport.service";

export const getSports = async (req: Request, res: Response) => {
  try {
    const data = await listSports(gymId(req));
    return res.status(RESPONSE_STATUS.ok).json(AppResponse.ok(data, "Sports fetched"));
  } catch (error) {
    const { status, body } = handleError("getSports", error);
    return res.status(status).json(body);
  }
};

export const addSport = async (req: Request, res: Response) => {
  try {
    const record = await createSport(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Sport added"));
  } catch (error) {
    const { status, body } = handleError("addSport", error);
    return res.status(status).json(body);
  }
};

export const editSport = async (req: Request, res: Response) => {
  try {
    const record = await updateSport(gymId(req), pathId(req), req.body);
    return res.status(RESPONSE_STATUS.ok).json(AppResponse.ok(record, "Sport updated"));
  } catch (error) {
    const { status, body } = handleError("editSport", error);
    return res.status(status).json(body);
  }
};

export const removeSport = async (req: Request, res: Response) => {
  try {
    const record = await deleteSport(gymId(req), pathId(req));
    return res.status(RESPONSE_STATUS.ok).json(AppResponse.ok(record, "Sport removed"));
  } catch (error) {
    const { status, body } = handleError("removeSport", error);
    return res.status(status).json(body);
  }
};
