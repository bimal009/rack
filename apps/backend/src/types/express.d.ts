import type { auth } from "../auth";
import type { gyms, staff } from "../db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: (typeof auth.$Infer.Session)["user"];
      session?: (typeof auth.$Infer.Session)["session"];
      gym?: typeof gyms.$inferSelect;
      staff?: typeof staff.$inferSelect;
    }
  }
}

export {};
