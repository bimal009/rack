import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    gym: r.one.gyms({
      from: r.user.id,
      to: r.gyms.ownerUserId,
    }),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  gyms: {
    owner: r.one.user({
      from: r.gyms.ownerUserId,
      to: r.user.id,
    }),
  },
}));
