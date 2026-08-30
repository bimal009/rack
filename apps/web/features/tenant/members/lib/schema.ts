import { z } from "zod"

export const memberStatuses = ["Active", "On Hold", "Expired"] as const
export type MemberStatus = (typeof memberStatuses)[number]

export const genders = ["Male", "Female", "Other", "Prefer not to say"] as const
export type Gender = (typeof genders)[number]

export const membershipSchema = z.object({
  membershipId: z.string(),
  membershipName: z.string(),
})

export type Membership = z.infer<typeof membershipSchema>

export const memberSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim().min(1, "Enter a last name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(genders).optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  memberships: z.array(membershipSchema).default([]),
})

export type MemberInput = z.infer<typeof memberSchema>

export interface Member extends MemberInput {
  id: string
  avatarUrl?: string
  joined: string
  status: MemberStatus
}
