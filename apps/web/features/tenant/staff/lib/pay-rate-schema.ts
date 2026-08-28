import { z } from "zod"

import { instructorTypes } from "./schema"

export const payRateModes = ["Class", "Individual Training"] as const
export type PayRateMode = (typeof payRateModes)[number]

export const payRateInstructorScopes = [
  "All Instructors",
  ...instructorTypes,
] as const
export type PayRateInstructorScope = (typeof payRateInstructorScopes)[number]

export const payRateEntranceMethods = [
  "All entrance methods",
  "Direct payment",
  "Any membership",
  "Any external program",
] as const
export type PayRateEntranceMethod = (typeof payRateEntranceMethods)[number]

export const payRateEntranceMethodGroups: {
  label: string | null
  options: readonly PayRateEntranceMethod[]
}[] = [
  { label: null, options: ["All entrance methods", "Direct payment"] },
  { label: "Memberships", options: ["Any membership"] },
  { label: "External programs", options: ["Any external program"] },
]

export const payRatePolicySchema = z.object({
  mode: z.enum(payRateModes),
  policyName: z.string().trim().min(1, "Enter a policy name"),
  perClassRate: z.number().nonnegative().optional(),
  perPersonRate: z.number().nonnegative().optional(),
  perSessionRate: z.number().nonnegative().optional(),
  revenueSharePercent: z.number().min(0).max(100).optional(),
  compensateUnpaidBookings: z.boolean(),
  classScope: z.string().trim().optional().or(z.literal("")),
  appliesToInstructorType: z.enum(payRateInstructorScopes),
  entranceMethod: z.enum(payRateEntranceMethods),
})

export type PayRatePolicyInput = z.infer<typeof payRatePolicySchema>
export interface PayRatePolicy extends PayRatePolicyInput {
  id: string
}
