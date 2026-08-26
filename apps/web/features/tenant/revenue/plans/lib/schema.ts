import { z } from "zod"

export const planCategories = [
  "Individual",
  "Couple",
  "Family",
  "Student",
  "Corporate",
] as const
export type PlanCategory = (typeof planCategories)[number]

export const planVisibilities = ["Public", "Private", "Hidden"] as const
export type PlanVisibility = (typeof planVisibilities)[number]

export const billingTypes = ["Monthly", "Quarterly", "Annual"] as const
export type BillingType = (typeof billingTypes)[number]

export const planCoverages = [
  "General plan",
  "Class access only",
  "Full facility access",
] as const
export type PlanCoverage = (typeof planCoverages)[number]

export const revenueAccounts = [
  "General Revenue",
  "Membership Revenue",
  "Retail Revenue",
  "Class Revenue",
] as const

export const planFeatureOptions = [
  "Personal Training",
  "Group Classes",
  "Sauna",
  "Pool Access",
  "Locker",
  "Towel Service",
  "Nutrition Coaching",
] as const

export const planSchema = z.object({
  name: z.string().trim().min(2, "Enter a plan name"),
  category: z.enum(planCategories),
  barcode: z.string().trim().optional().or(z.literal("")),
  visibility: z.enum(planVisibilities),
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

  coverage: z.enum(planCoverages),
  sessions: z.string().trim().optional().or(z.literal("")),

  features: z.string().optional().or(z.literal("")),
  sports: z.string().optional().or(z.literal("")),
})

export type PlanInput = z.infer<typeof planSchema>

export interface Plan extends PlanInput {
  id: string
  members: number
}
