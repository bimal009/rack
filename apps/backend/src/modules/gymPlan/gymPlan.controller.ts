import { Request, Response } from "express";
import { membershipPlanListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createMembershipPlan,
  deleteMembershipPlan,
  getMembershipPlan,
  listMembershipPlans,
  updateMembershipPlan,
} from "./membershipPlan.service";

export const getMembershipPlans = async (req: Request, res: Response) => {
  try {
    const query = membershipPlanListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listMembershipPlans(gymId(req), query.data);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Membership plans fetched"));
  } catch (error) {
    const { status, body } = handleError("getMembershipPlans", error);
    return res.status(status).json(body);
  }
};

export const getMembershipPlanById = async (req: Request, res: Response) => {
  try {
    const record = await getMembershipPlan(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership plan fetched"));
  } catch (error) {
    const { status, body } = handleError("getMembershipPlanById", error);
    return res.status(status).json(body);
  }
};

export const addMembershipPlan = async (req: Request, res: Response) => {
  try {
    const record = await createMembershipPlan(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Membership plan created"));
  } catch (error) {
    const { status, body } = handleError("addMembershipPlan", error);
    return res.status(status).json(body);
  }
};

export const editMembershipPlan = async (req: Request, res: Response) => {
  try {
    const record = await updateMembershipPlan(
      gymId(req),
      pathId(req),
      req.body
    );
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership plan updated"));
  } catch (error) {
    const { status, body } = handleError("editMembershipPlan", error);
    return res.status(status).json(body);
  }
};

export const removeMembershipPlan = async (req: Request, res: Response) => {
  try {
    const record = await deleteMembershipPlan(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership plan removed"));
  } catch (error) {
    const { status, body } = handleError("removeMembershipPlan", error);
    return res.status(status).json(body);
  }
};
