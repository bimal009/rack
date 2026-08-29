import { Request, Response } from "express";
import { UnauthorizedError, handleError } from "../../lib/errors";
import { AppResponse, RESPONSE_STATUS } from "../../lib/response";
import { getImageKitAuthParams } from "../../lib/imagekit";

export const getImageKitAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError("Unauthorized access");

    const params = getImageKitAuthParams();

    return res
      .status(RESPONSE_STATUS.ok)
      .json(AppResponse.ok(params, "Upload authorized"));
  } catch (error) {
    const { status, body } = handleError("getImageKitAuth", error);
    return res.status(status).json(body);
  }
};
