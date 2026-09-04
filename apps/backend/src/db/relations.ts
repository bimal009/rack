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
    gymPlans: r.many.gymPlan(),
    products: r.many.product(),
    productFeatures: r.many.productFeature(),
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

  gymPlan: {
    gym: r.one.gyms({
      from: r.gymPlan.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    category: r.one.membershipCategory({
      from: r.gymPlan.categoryId,
      to: r.membershipCategory.id,
      optional: false,
    }),
    sports: r.many.gymPlanSport(),
    features: r.many.gymPlanFeature(),
  },

  membershipCategory: {
    gym: r.one.gyms({
      from: r.membershipCategory.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    plans: r.many.gymPlan(),
  },

  gymSport: {
    gym: r.one.gyms({
      from: r.gymSport.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    plans: r.many.gymPlanSport(),
  },

  gymFeature: {
    gym: r.one.gyms({
      from: r.gymFeature.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    plans: r.many.gymPlanFeature(),
  },

  gymPlanSport: {
    gym: r.one.gyms({
      from: r.gymPlanSport.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    plan: r.one.gymPlan({
      from: r.gymPlanSport.planId,
      to: r.gymPlan.id,
      optional: false,
    }),
    sport: r.one.gymSport({
      from: r.gymPlanSport.sportId,
      to: r.gymSport.id,
      optional: false,
    }),
  },

  gymPlanFeature: {
    gym: r.one.gyms({
      from: r.gymPlanFeature.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    plan: r.one.gymPlan({
      from: r.gymPlanFeature.planId,
      to: r.gymPlan.id,
      optional: false,
    }),
    feature: r.one.gymFeature({
      from: r.gymPlanFeature.featureId,
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

  product: {
    gym: r.one.gyms({
      from: r.product.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    category: r.one.productCategory({
      from: r.product.categoryId,
      to: r.productCategory.id,
      optional: false,
    }),
    brand: r.one.brand({
      from: r.product.brandId,
      to: r.brand.id,
    }),
    taxRate: r.one.taxRate({
      from: r.product.taxRateId,
      to: r.taxRate.id,
    }),
  },

  productCategory: {
    gym: r.one.gyms({
      from: r.productCategory.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    products: r.many.product(),
  },

  brand: {
    gym: r.one.gyms({
      from: r.brand.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    products: r.many.product(),
  },

  taxRate: {
    gym: r.one.gyms({
      from: r.taxRate.gymId,
      to: r.gyms.id,
      optional: false,
    }),
    products: r.many.product(),
  },

  productFeature: {
    gym: r.one.gyms({
      from: r.productFeature.gymId,
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
