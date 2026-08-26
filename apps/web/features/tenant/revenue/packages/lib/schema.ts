import { z } from "zod"

export const packageVisibilities = ["Public", "Private", "Hidden"] as const
export type PackageVisibility = (typeof packageVisibilities)[number]

export const packageItemTypes = ["plan", "product"] as const
export type PackageItemType = (typeof packageItemTypes)[number]

export const packageItemSchema = z.object({
  type: z.enum(packageItemTypes),
  refId: z.string(),
  name: z.string(),
  quantity: z.coerce.number().int("Whole numbers only").positive("Enter at least 1"),
})

export type PackageItem = z.infer<typeof packageItemSchema>

export const packageSchema = z.object({
  name: z.string().trim().min(2, "Enter a package name"),
  price: z.coerce.number().positive("Enter a price greater than 0"),
  visibility: z.enum(packageVisibilities),
  active: z.boolean(),
  description: z
    .string()
    .trim()
    .max(300, "Keep it under 300 characters")
    .optional()
    .or(z.literal("")),
  useSingleQuantity: z.boolean(),
  items: z.array(packageItemSchema).min(1, "Add at least one plan or product"),
  bookable: z.boolean(),
})

export type PackageInput = z.infer<typeof packageSchema>

export interface Package extends PackageInput {
  id: string
}
