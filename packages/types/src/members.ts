import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const memberGenderEnumSchema = z.enum([
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
]);
export type MemberGender = z.infer<typeof memberGenderEnumSchema>;

export const memberStatusEnumSchema = z.enum(["Active", "On Hold", "Expired"]);
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

const memberWithUserInsertObject = z.object({
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim().min(1, "Enter a last name"),
  email: z.string().trim().email("Enter a valid email address"),
  image: z.string().url().nullish(),

  status: memberStatusEnumSchema.default("Active"),

  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  dateOfBirth: optionalText,
  gender: z
    .union([memberGenderEnumSchema, z.literal(""), z.null()])
    .optional()
    .transform((value) => (value ? value : null)),
  address: optionalText,
});

export const memberWithUserInsertSchema = memberWithUserInsertObject;
export type NewMemberWithUser = z.infer<typeof memberWithUserInsertSchema>;

export const memberUpdateSchema = memberWithUserInsertObject
  .omit({ firstName: true, lastName: true, email: true, image: true })
  .partial();
export type UpdateMember = z.infer<typeof memberUpdateSchema>;

export type MemberProfileUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type MemberWithUser = Omit<
  Member,
  "joinedAt" | "createdAt" | "updatedAt"
> & {
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
