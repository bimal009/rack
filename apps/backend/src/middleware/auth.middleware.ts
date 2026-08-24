import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import { UnauthorizedError } from "../lib/errors";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const result = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!result) {
    throw new UnauthorizedError("Unauthorized access");
  }

  req.user = result.user;
  req.session = result.session;
  next();
};
