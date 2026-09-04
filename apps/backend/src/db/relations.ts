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
  },

  memberMembership: {
    gym: r.one.gyms({
      from: r.memberMembership.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    category: r.one.membershipCategory({
      from: r.memberMembership.categoryId,
      to: r.membershipCategory.id,
      optional: false,
    }),
    sports: r.many.membershipSport(),
    features: r.many.membershipFeature(),
  },

  membershipCategory: {
    gym: r.one.gyms({
      from: r.membershipCategory.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    memberships: r.many.memberMembership(),
  },

  gymSport: {
    gym: r.one.gyms({
      from: r.gymSport.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    memberships: r.many.membershipSport(),
  },

  gymFeature: {
    gym: r.one.gyms({
      from: r.gymFeature.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    memberships: r.many.membershipFeature(),
  },

  membershipSport: {
    gym: r.one.gyms({
      from: r.membershipSport.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    membership: r.one.memberMembership({
      from: r.membershipSport.membershipId,
      to: r.memberMembership.id,
      optional: false,
    }),
    sport: r.one.gymSport({
      from: r.membershipSport.sportId,
      to: r.gymSport.id,
      optional: false,
    }),
  },

  membershipFeature: {
    gym: r.one.gyms({
      from: r.membershipFeature.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    membership: r.one.memberMembership({
      from: r.membershipFeature.membershipId,
      to: r.memberMembership.id,
      optional: false,
    }),
    feature: r.one.gymFeature({
      from: r.membershipFeature.featureId,
      to: r.gymFeature.id,
      optional: false,
    }),
  },

  areaType: {
    gym: r.one.gyms({
      from: r.areaType.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    areas: r.many.area(),
  },

  area: {
    gym: r.one.gyms({
      from: r.area.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    areaType: r.one.areaType({
      from: r.area.areaTypeId,
      to: r.areaType.id,
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
