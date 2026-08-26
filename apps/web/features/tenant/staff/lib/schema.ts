import { z } from "zod"

export const staffRoles = ["Instructor", "Front Desk", "Manager"] as const
export type StaffRole = (typeof staffRoles)[number]

export const staffStatuses = ["Active", "Inactive"] as const
export type StaffStatus = (typeof staffStatuses)[number]

export const payTypes = ["Hourly", "Monthly", "Per Class"] as const
export type PayType = (typeof payTypes)[number]

export const instructorTypes = [
  "None",
  "Boxing Coach",
  "Group Fitness Instructor",
  "Personal Trainer",
  "Yoga Instructor",
  "Strength Coach",
] as const
export type InstructorType = (typeof instructorTypes)[number]

export const staffVisibilities = ["Public", "Private"] as const
export type StaffVisibility = (typeof staffVisibilities)[number]

export const staffGenders = ["Male", "Female", "Other", "Prefer not to say"] as const
export type StaffGender = (typeof staffGenders)[number]

export const staffSchema = z.object({
  allowAdminAccess: z.boolean(),
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim().min(1, "Enter a last name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(staffGenders).optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  role: z.enum(staffRoles),
  payType: z.enum(payTypes),
  payRate: z.number().positive("Enter a pay rate"),
  displayName: z.string().trim().optional().or(z.literal("")),
  instructorType: z.enum(instructorTypes),
  sports: z.string().trim().optional().or(z.literal("")),
  experience: z.string().trim().optional().or(z.literal("")),
  certifications: z.string().trim().optional().or(z.literal("")),
  canBeBooked: z.boolean(),
  visibility: z.enum(staffVisibilities),
  maxConcurrentBookings: z.number().int().positive(),
  activeInstructor: z.boolean(),
})

export type StaffInput = z.infer<typeof staffSchema>

export interface StaffMember extends StaffInput {
  id: string
  avatarUrl?: string
  joined: string
  status: StaffStatus
}
