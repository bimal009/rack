import { eq } from "drizzle-orm";
import { db } from "../../db";
import { plan } from "../../db/schema";
import { NotFoundError} from "../../lib/errors";

export  async function get(){
    const plans = await db
  .select()
  .from(plan)
  .where(eq(plan.isActive, true))
  .orderBy(plan.monthlyPrice);
 if (plans.length === 0) {
     throw new NotFoundError("No plans found");
    }

    return plans
}