import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";
import { gymMembershipAssignmentSchema } from "./gymMembershipAssignment";

export const memberGenderEnumSchema = z.enum([
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
]);
export type MemberGender = z.infer<typeof memberGenderEnumSchema>;

export const memberStatusEnumSchema = z.enum(["Active", "Inactive"]);
export type MemberStatus = z.infer<typeof memberStatusEnumSchema>;

export const memberSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  userId: z.string(),
  status: memberStatusEnumSchema.default("Active"),

  phone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: memberGenderEnumSchema.nullable(),
  address: z.string().nullable(),

  joinedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Member = z.infer<typeof memberSchema>;

const optionalText = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed.length > 0 ? trimmed : null;
  });

export const phoneSchema = z
  .string()
  .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97");

export const memberUserFieldsSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  email: z
    .union([z.string().trim().email("Enter a valid email address"), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  image: z.string().url().nullish(),
});
export type MemberUserFields = z.infer<typeof memberUserFieldsSchema>;

// --- member block (no membership here anymore) ---
export const memberFieldsSchema = z.object({
  status: memberStatusEnumSchema.default("Active"),
  phone: phoneSchema,
  dateOfBirth: optionalText,
  gender: z
    .union([memberGenderEnumSchema, z.literal(""), z.null()])
    .optional()
    .transform((value) => (value ? value : null)),
  address: optionalText,
});
export type MemberFields = z.infer<typeof memberFieldsSchema>;

export const memberWithUserAndMembershipInsertSchema = z.object({
  user: memberUserFieldsSchema,
  member: memberFieldsSchema,
  membership: gymMembershipAssignmentSchema.optional(),
});
export type NewMemberWithUser = z.infer<typeof memberWithUserAndMembershipInsertSchema>;

export const memberUpdateSchema = z.object({
  user: memberUserFieldsSchema.partial().optional(),
  member: memberFieldsSchema.partial().optional(),
});
export type UpdateMember = z.infer<typeof memberUpdateSchema>;

export function generateMemberEmail(name: string, phone: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return `${slug}@${phone}.chautari.fit`;
}

export type MemberProfileUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type MemberWithUser = Omit<Member, "joinedAt" | "createdAt" | "updatedAt"> & {
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  user: MemberProfileUser;
};

export const memberListQuerySchema = z.object({
  ...paginationFields,
  status: memberStatusEnumSchema.optional(),
});
export type MemberListQuery = z.infer<typeof memberListQuerySchema>;

export type MemberListResponse = PaginatedResponse<MemberWithUser>;

export type CreateMemberResult = {
  user: MemberProfileUser;
  member: Member;
};

const SYNTHETIC_EMAIL_SUFFIX = ".chautari.fit";
export const isSyntheticEmail = (email: string) => email.endsWith(SYNTHETIC_EMAIL_SUFFIX);

export const memberWithUserSchema = memberSchema.extend({
  user: memberUserFieldsSchema,
})