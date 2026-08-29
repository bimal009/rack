import { z } from "zod";
import { userInsertSchema } from "./user";
import { basePaginationSchema } from "./pagination";

export const gymRoleEnumSchema = z.enum(["admin", "manager", "instructor", "frontdesk"]);

export const staffSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  userId: z.string(),
  role: gymRoleEnumSchema,
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Staff = z.infer<typeof staffSchema>;

export const staffInsertSchema = staffSchema.omit({
  id: true,
  gymId:true,
  createdAt: true,
  updatedAt: true,
});

export type NewStaff = z.infer<typeof staffInsertSchema>;

export const staffWithUserInsertSchema = userInsertSchema
  .pick({ name: true, email: true, image: true })
  .extend(staffInsertSchema.pick({ role: true, isActive: true }).shape);

export type NewStaffWithUser = z.infer<typeof staffWithUserInsertSchema>;

export const staffPaginationSchema = basePaginationSchema.extend({
  status: z.enum(["active", "inactive"]).optional(),
  role: gymRoleEnumSchema.optional(),
});

export type StaffPagination = z.infer<typeof staffPaginationSchema>;

export type StaffMemberUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type StaffWithUser = Omit<Staff, "userId" | "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  user: StaffMemberUser;
};