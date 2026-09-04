import { Request, Response } from "express";
import { memberListQuerySchema } from "@repo/types";
import { ForbiddenError, ValidationError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { gymId, pathId } from "../../lib/helper";
import {
  createMemberWithUser,
  deleteMember,
  getAllMembers,
  getMemberById,
  updateMember,
} from "./member.service";

export const createMember = async (req: Request, res: Response) => {
  try {
    const gym = req.gym;
    if (!gym) throw new ForbiddenError("Gym context is missing");

    const record = await createMemberWithUser(req.body, gym.id);

    return res
      .status(RESPONSE_STATUS.created)
      .json(AppResponse.created(record, "Member created successfully"));
  } catch (error) {
    const { status, body } = handleError("createMember", error);
    return res.status(status).json(body);
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const query = memberListQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new ValidationError("Invalid query params", query.error.flatten());
    }
    const { data, meta } = await getAllMembers(gymId(req), query.data);

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.paginated(data, meta, "Members fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getMembers", error);
    return res.status(status).json(body);
  }
};

export const getMember = async (req: Request, res: Response) => {
  try {
    const record = await getMemberById(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Member fetched successfully"));
  } catch (error) {
    const { status, body } = handleError("getMember", error);
    return res.status(status).json(body);
  }
};

export const editMember = async (req: Request, res: Response) => {
  try {
    const record = await updateMember(gymId(req), pathId(req), req.body);
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Member updated successfully"));
  } catch (error) {
    const { status, body } = handleError("editMember", error);
    return res.status(status).json(body);
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const record = await deleteMember(gymId(req), pathId(req));
    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(record, "Member removed successfully"));
  } catch (error) {
    const { status, body } = handleError("removeMember", error);
    return res.status(status).json(body);
  }
};
