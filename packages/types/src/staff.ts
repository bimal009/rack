import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const gymRoleEnumSchema = z.enum(["admin", "manager", "instructor", "frontdesk"]);

export type GymRole = z.infer<typeof gymRoleEnumSchema>;


export const payTypeEnumSchema = z.enum(["Hourly", "Monthly", "Per Class"]);
export type PayType = z.infer<typeof payTypeEnumSchema>;

export const staffGenderEnumSchema = z.enum([
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
]);
export type StaffGender = z.infer<typeof staffGenderEnumSchema>;

export const staffVisibilityEnumSchema = z.enum(["Public", "Private"]);
export type StaffVisibility = z.infer<typeof staffVisibilityEnumSchema>;

export const staffSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  userId: z.string(),
  role: gymRoleEnumSchema,
  isActive: z.boolean().default(true),

  allowAdminAccess: z.boolean().default(false),
  phone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: staffGenderEnumSchema.nullable(),
  address: z.string().nullable(),
  payType: payTypeEnumSchema.nullable(),
  payRate: z.number().nullable(),
  instructorTypeId: z.string().uuid().nullable(),
  experience: z.string().nullable(),
  certifications: z.string().nullable(),
  canBeBooked: z.boolean().default(false),
  visibility: staffVisibilityEnumSchema.default("Public"),
  maxConcurrentBookings: z.number().int().positive().default(1),
  activeInstructor: z.boolean().default(true),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Staff = z.infer<typeof staffSchema>;

export const staffInsertSchema = staffSchema.omit({
  id: true,
  gymId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type NewStaff = z.infer<typeof staffInsertSchema>;


const optionalText = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed.length > 0 ? trimmed : null;
  });

export const staffWithUserInsertSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim().min(1, "Enter a last name"),
  email: z.string().trim().email("Enter a valid email address"),
  image: z.string().url().nullish(),

  role: gymRoleEnumSchema,
  isActive: z.boolean().default(true),
  allowAdminAccess: z.boolean().default(false),

  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  dateOfBirth: optionalText,
  gender: z
    .union([staffGenderEnumSchema, z.literal(""), z.null()])
    .optional()
    .transform((value) => (value ? value : null)),
  address: optionalText,

  payType: payTypeEnumSchema,
  payRate: z.number().positive("Enter a pay rate"),

  instructorTypeId: z
    .union([z.string().uuid(), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value ? value : null)),
  experience: optionalText,
  certifications: optionalText,
  canBeBooked: z.boolean().default(false),
  visibility: staffVisibilityEnumSchema.default("Public"),
  maxConcurrentBookings: z.number().int().positive().default(1),
  activeInstructor: z.boolean().default(true),
});

export type NewStaffWithUser = z.infer<typeof staffWithUserInsertSchema>;


export type StaffMemberUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type StaffWithUser = Omit<Staff, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  user: StaffMemberUser;
};

export const staffListQuerySchema = z.object({
  ...paginationFields,
  role: gymRoleEnumSchema.optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type StaffListQuery = z.infer<typeof staffListQuerySchema>;

export type StaffListResponse = PaginatedResponse<StaffWithUser>;

export type CreateStaffResult = {
  user: StaffMemberUser;
  staff: StaffWithUser;
};
