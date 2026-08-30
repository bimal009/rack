import { z } from "zod"

export const membershipCategories = [
  "Individual",
  "Couple",
  "Family",
  "Student",
  "Corporate",
] as const
export type MembershipCategory = (typeof membershipCategories)[number]

export const membershipVisibilities = ["Public", "Private", "Hidden"] as const
export type MembershipVisibility = (typeof membershipVisibilities)[number]

export const billingTypes = ["Monthly", "Quarterly", "Annual"] as const
export type BillingType = (typeof billingTypes)[number]

export const membershipCoverages = ["Full access", "Restricted"] as const
export type MembershipCoverage = (typeof membershipCoverages)[number]

export const revenueAccounts = [
  "General Revenue",
  "Membership Revenue",
  "Retail Revenue",
  "Class Revenue",
] as const

export const membershipFeatureOptions = [
  "Personal Training",
  "Group Classes",
  "Sauna",
  "Pool Access",
  "Locker",
  "Towel Service",
  "Nutrition Coaching",
] as const

const uuidList = z.array(z.string()).nullish()

export const membershipSchema = z.object({
  name: z.string().trim().min(2, "Enter a membership name"),
  category: z.enum(membershipCategories),
  barcode: z.string().trim().optional().or(z.literal("")),
  visibility: z.enum(membershipVisibilities),
  description: z
    .string()
    .trim()
    .max(300, "Keep it under 300 characters")
    .optional()
    .or(z.literal("")),
  active: z.boolean(),

  pricePerPeriod: z.coerce.number().nonnegative("Enter a valid price"),
  billingType: z.enum(billingTypes),
  signupFee: z.coerce.number().nonnegative("Enter a valid fee").optional(),
  requirePaymentUpfront: z.boolean(),

  coverage: z.enum(membershipCoverages),
  coverageClasses: uuidList,
  coverageAreas: uuidList,
  coverageInstructors: uuidList,
  noClasses: z.boolean().default(false),
  noAreas: z.boolean().default(false),
  noInstructors: z.boolean().default(false),
  sessions: z.string().trim().optional().or(z.literal("")),

  features: z.string().optional().or(z.literal("")),
  sports: z.string().optional().or(z.literal("")),
})

export type MembershipInput = z.infer<typeof membershipSchema>

export interface Membership extends MembershipInput {
  id: string
  members: number
}
