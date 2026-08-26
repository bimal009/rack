import { z } from "zod"

export const staffRoles = [
  "Instructor",
  "Personal Trainer",
  "Front Desk",
  "Manager",
] as const
export type StaffRole = (typeof staffRoles)[number]

export const staffStatuses = ["Active", "Inactive"] as const
export type StaffStatus = (typeof staffStatuses)[number]

export const payTypes = ["Hourly", "Monthly", "Per Class"] as const
export type PayType = (typeof payTypes)[number]

export const staffSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim().min(1, "Enter a last name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  role: z.enum(staffRoles),
  specialty: z.string().trim().optional().or(z.literal("")),
  payType: z.enum(payTypes),
  payRate: z.number().positive("Enter a pay rate"),
})

export type StaffInput = z.infer<typeof staffSchema>

export interface StaffMember extends StaffInput {
  id: string
  avatarUrl?: string
  joined: string
  status: StaffStatus
}
