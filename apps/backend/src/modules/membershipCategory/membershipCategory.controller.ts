import { Request, Response } from "express";
import { membershipCategoryListQuerySchema } from "@repo/types";
import { ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createMembershipCategory,
  deleteMembershipCategory,
  listMembershipCategories,
  updateMembershipCategory,
} from "./membershipCategory.service";

export const getMembershipCategories = async (req: Request, res: Response) => {
  try {
    const query = membershipCategoryListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await listMembershipCategories(
      gymId(req),
      query.data
    );
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Membership categories fetched"));
  } catch (error) {
    const { status, body } = handleError("getMembershipCategories", error);
    return res.status(status).json(body);
  }
};

export const addMembershipCategory = async (req: Request, res: Response) => {
  try {
    const record = await createMembershipCategory(gymId(req), req.body);
    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Membership category created"));
  } catch (error) {
    const { status, body } = handleError("addMembershipCategory", error);
    return res.status(status).json(body);
  }
};

export const editMembershipCategory = async (req: Request, res: Response) => {
  try {
    const record = await updateMembershipCategory(
      gymId(req),
      pathId(req),
      req.body
    );
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership category updated"));
  } catch (error) {
    const { status, body } = handleError("editMembershipCategory", error);
    return res.status(status).json(body);
  }
};

export const removeMembershipCategory = async (req: Request, res: Response) => {
  try {
    const record = await deleteMembershipCategory(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Membership category removed"));
  } catch (error) {
    const { status, body } = handleError("removeMembershipCategory", error);
    return res.status(status).json(body);
  }
};
