import { z } from "zod";

export const roleEnumSchema = z.enum(["user", "admin"]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  role: roleEnumSchema.default("user"),
  onboarded: z.boolean().default(false),
  isClaimed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const userInsertSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
  role:true,
  id:true
});

export type NewUser = z.infer<typeof userInsertSchema>;