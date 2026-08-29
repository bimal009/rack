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
    staffProfiles: r.many.staff(),
    memberProfiles: r.many.member(),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
      optional: false,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
      optional: false,
    }),
  },

  gyms: {
    owner: r.one.user({
      from: r.gyms.ownerUserId,
      to: r.user.id,
      optional: false,
    }),
    staff: r.many.staff(),
    members: r.many.member(),
    rolePermissionOverrides: r.many.gymRolePermissionOverride(),
    memberMemberships: r.many.memberMembership(),
    subscriptions: r.many.gymSubscription(),
  },

  permission: {
    rolePermissions: r.many.rolePermission(),
    rolePermissionOverrides: r.many.gymRolePermissionOverride(),
  },

  rolePermission: {
    permission: r.one.permission({
      from: r.rolePermission.permissionId,
      to: r.permission.id,
      optional: false,
    }),
  },

  gymRolePermissionOverride: {
    gym: r.one.gyms({
      from: r.gymRolePermissionOverride.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    permission: r.one.permission({
      from: r.gymRolePermissionOverride.permissionId,
      to: r.permission.id,
      optional: false,
    }),
  },

  staff: {
    gym: r.one.gyms({
      from: r.staff.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    user: r.one.user({
      from: r.staff.userId,
      to: r.user.id,
    }),
  },

  member: {
    gym: r.one.gyms({
      from: r.member.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    user: r.one.user({
      from: r.member.userId,
      to: r.user.id,
    }),
    memberships: r.many.memberMembership(),
  },

  memberMembership: {
    member: r.one.member({
      from: r.memberMembership.memberId,
      to: r.member.id,
      optional: false,
    }),
    gym: r.one.gyms({
      from: r.memberMembership.gymId,
      to: r.gyms.id,
      optional: false,
    }),
  },

  plan: {
    subscriptions: r.many.gymSubscription(),
  },

  gymSubscription: {
    gym: r.one.gyms({
      from: r.gymSubscription.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    plan: r.one.plan({
      from: r.gymSubscription.planId,
      to: r.plan.id,
      optional: false,
    }),
  },
}));
