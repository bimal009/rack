import { z } from "zod"

export const packageStatuses = ["Active", "Draft", "Archived"] as const
export type PackageStatus = (typeof packageStatuses)[number]

export const packageSchema = z.object({
  name: z.string().trim().min(2, "Enter a package name"),
  sessions: z.coerce
    .number()
    .int("Whole numbers only")
    .positive("Enter at least 1 session"),
  price: z.coerce.number().positive("Enter a price greater than 0"),
  validityDays: z.coerce
    .number()
    .int("Whole numbers only")
    .positive("Enter validity in days"),
  status: z.enum(packageStatuses),
})

export type PackageInput = z.infer<typeof packageSchema>

export interface Package extends PackageInput {
  id: string
}
