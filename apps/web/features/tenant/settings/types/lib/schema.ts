import { z } from "zod"

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
})

export type ClassTypeInput = z.infer<typeof classTypeSchema>
export interface ClassType extends ClassTypeInput {
  id: string
}

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
