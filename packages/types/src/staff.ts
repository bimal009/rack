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
  isOwner: z.boolean().default(false),
  isActive: z.boolean().default(true),

  phone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: staffGenderEnumSchema.nullable(),
  address: z.string().nullable(),
  payType: payTypeEnumSchema.nullable(),
  payRate: z.number().nullable(),
  instructorTypeId: z.string().uuid().nullable(),
  experience: z.number().int().nullable(),
  certifications: z.string().nullable(),
  canBeBooked: z.boolean().default(false),
  visibility: staffVisibilityEnumSchema.default("Public"),
  maxConcurrentBookings: z.number().int().positive().default(1),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Staff = z.infer<typeof staffSchema>;

export const staffInsertSchema = staffSchema.omit({
  id: true,
  gymId: true,
  userId: true,
  isOwner: true,
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

const staffWithUserInsertObject = z.object({
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim().min(1, "Enter a last name"),
  email: z.string().trim().email("Enter a valid email address"),
  image: z.string().url().nullish(),

  role: gymRoleEnumSchema,
  isActive: z.boolean().default(true),

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
  experience: z
    .union([z.number().int().nonnegative(), z.null()])
    .optional()
    .transform((value) => (value == null ? null : value)),
  certifications: optionalText,
  canBeBooked: z.boolean().default(false),
  visibility: staffVisibilityEnumSchema.default("Public"),
  maxConcurrentBookings: z.number().int().positive().default(1),
});

const requireInstructorFields = (
  data: { role?: string; instructorTypeId?: unknown; experience?: unknown },
  ctx: z.RefinementCtx
) => {
  if (data.role !== "instructor") return;

  if (!data.instructorTypeId) {
    ctx.addIssue({
      code: "custom",
      path: ["instructorTypeId"],
      message: "Select an instructor type",
    });
  }

  if (data.experience == null) {
    ctx.addIssue({
      code: "custom",
      path: ["experience"],
      message: "Enter years of experience",
    });
  }
};

export const staffWithUserInsertSchema =
  staffWithUserInsertObject.superRefine(requireInstructorFields);

export type NewStaffWithUser = z.infer<typeof staffWithUserInsertSchema>;

export const staffUpdateSchema = staffWithUserInsertObject
  .omit({ firstName: true, lastName: true, email: true, image: true })
  .partial();

export type UpdateStaff = z.infer<typeof staffUpdateSchema>;


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
