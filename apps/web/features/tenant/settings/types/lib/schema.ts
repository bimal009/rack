import { z } from "zod"

import { productRevenueAccounts } from "@/features/tenant/revenue/products/lib/schema"
import { attendanceMethods } from "@/features/tenant/attendance/lib/schema"
import { staffRoles } from "@/features/tenant/staff/lib/schema"

export const revenueAccounts = productRevenueAccounts

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const areaTypeSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a slug")
    .regex(slugRegex, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().optional().or(z.literal("")),
  sports: z.string().trim().optional().or(z.literal("")),
  availableForBooking: z.boolean(),
  pricePerHour: z.number().nonnegative(),
  maxPlayers: z.number().int().positive(),
  maxConcurrentBookings: z.number().int().positive(),
  revenueAccount: z.string().trim().optional().or(z.literal("")),
})

export type AreaTypeInput = z.infer<typeof areaTypeSchema>
export interface AreaType extends AreaTypeInput {
  id: string
}

export const instructorTypeSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a slug")
    .regex(slugRegex, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().optional().or(z.literal("")),
  maxConcurrentBookings: z.number().int().positive(),
  revenueAccount: z.string().trim().optional().or(z.literal("")),
})

export type InstructorTypeInput = z.infer<typeof instructorTypeSchema>
export interface InstructorTypeRecord extends InstructorTypeInput {
  id: string
}

export const classTypeSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a slug")
    .regex(slugRegex, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().optional().or(z.literal("")),
  sports: z.string().trim().optional().or(z.literal("")),
  availableForBooking: z.boolean(),
  pricePerClass: z.number().nonnegative(),
  maxParticipants: z.number().int().positive(),
  maxConcurrentBookings: z.number().int().positive(),
  revenueAccount: z.string().trim().optional().or(z.literal("")),
})

export type ClassTypeInput = z.infer<typeof classTypeSchema>
export interface ClassType extends ClassTypeInput {
  id: string
}

export const simpleTypeKinds = ["Brand", "Category", "Tax Rate"] as const
export type SimpleTypeKind = (typeof simpleTypeKinds)[number]

export const simpleTypeSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  slug: z
    .string()
    .trim()
    .regex(slugRegex, "Lowercase letters, numbers, and hyphens only")
    .optional()
    .or(z.literal("")),
  rate: z.number().min(0).max(100).optional(),
})

export type SimpleTypeInput = z.infer<typeof simpleTypeSchema>
export interface SimpleType extends SimpleTypeInput {
  id: string
}

export const payRateAppliesTo = ["All Roles", ...staffRoles] as const
export type PayRateAppliesTo = (typeof payRateAppliesTo)[number]

export const payRateEntranceMethods = [
  "All entrance methods",
  ...attendanceMethods,
] as const
export type PayRateEntranceMethod = (typeof payRateEntranceMethods)[number]

export const payRatePolicySchema = z.object({
  policyName: z.string().trim().min(1, "Enter a policy name"),
  perSessionRate: z.number().nonnegative().optional(),
  revenueSharePercent: z.number().min(0).max(100).optional(),
  compensateUnpaidBookings: z.boolean(),
  appliesTo: z.enum(payRateAppliesTo),
  entranceMethod: z.enum(payRateEntranceMethods),
})

export type PayRatePolicyInput = z.infer<typeof payRatePolicySchema>
export interface PayRatePolicy extends PayRatePolicyInput {
  id: string
}
