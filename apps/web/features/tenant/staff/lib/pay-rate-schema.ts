import { z } from "zod"

import { attendanceMethods } from "@/features/tenant/attendance/lib/schema"

import { staffRoles } from "./schema"

export const payRateModes = ["Class", "Individual Training"] as const
export type PayRateMode = (typeof payRateModes)[number]

export const payRateAppliesToRoles = ["All Roles", ...staffRoles] as const
export type PayRateAppliesToRole = (typeof payRateAppliesToRoles)[number]

export const payRateEntranceMethods = [
  "All entrance methods",
  ...attendanceMethods,
] as const
export type PayRateEntranceMethod = (typeof payRateEntranceMethods)[number]

export const payRatePolicySchema = z.object({
  mode: z.enum(payRateModes),
  policyName: z.string().trim().min(1, "Enter a policy name"),
  perClassRate: z.number().nonnegative().optional(),
  perPersonRate: z.number().nonnegative().optional(),
  perSessionRate: z.number().nonnegative().optional(),
  revenueSharePercent: z.number().min(0).max(100).optional(),
  compensateUnpaidBookings: z.boolean(),
  classScope: z.string().trim().optional().or(z.literal("")),
  appliesToRole: z.enum(payRateAppliesToRoles),
  entranceMethod: z.enum(payRateEntranceMethods),
})

export type PayRatePolicyInput = z.infer<typeof payRatePolicySchema>
export interface PayRatePolicy extends PayRatePolicyInput {
  id: string
}
