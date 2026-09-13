import { Request, Response } from "express";
import { gymMembershipListQuerySchema } from "@repo/types";
import { handleError, ValidationError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createMemberMembership,
  extendMemberMembership,
  getMemberMembership,
  listMembership,
  updateMemberMembership,
} from "./gymMembership.service";

export const getMemberships = async (req: Request, res: Response) => {
  try {
    const query = gymMembershipListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }

    const { data, meta } = await listMembership(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Memberships fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getMemberships", error);
    return res.status(status).json(body);
  }
};

export const getMembership = async (req: Request, res: Response) => {
  try {
    const record = await getMemberMembership(gymId(req), pathId(req, "memberId"));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getMembership", error);
    return res.status(status).json(body);
  }
};

export const addMembership = async (req: Request, res: Response) => {
  try {
    const record = await createMemberMembership(
      gymId(req),
      pathId(req, "memberId"),
      req.body
    );
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Membership added successfully"));
  } catch (error) {
    const { status, body } = handleError("addMembership", error);
    return res.status(status).json(body);
  }
};

export const editMembership = async (req: Request, res: Response) => {
  try {
    const record = await updateMemberMembership(
      gymId(req),
      pathId(req, "memberId"),
      pathId(req, "id"),
      req.body
    );
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership updated successfully"));
  } catch (error) {
    const { status, body } = handleError("editMembership", error);
    return res.status(status).json(body);
  }
};

export const extendMembership = async (req: Request, res: Response) => {
  try {
    const record = await extendMemberMembership(
      gymId(req),
      pathId(req, "memberId"),
      pathId(req, "id"),
      req.body
    );
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership extended successfully"));
  } catch (error) {
    const { status, body } = handleError("extendMembership", error);
    return res.status(status).json(body);
  }
};
