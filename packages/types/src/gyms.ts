import { z } from "zod";

export const SPECIALTY_OPTIONS = [
  "Strength Training",
  "CrossFit",
  "HIIT",
  "Indoor Cycling",
  "Boxing",
  "Yoga",
  "Pilates",
  "Stretching",
  "Personal Training",
  "Group Classes",
] as const;

export const onboardingSchema = z.object({
  businessType: z.enum([
    "gym",
    "fitness-studio",
    "yoga-pilates",
    "martial-arts",
    "personal-training",
    "something-else",
  ]),
  specialties: z
    .array(z.enum(SPECIALTY_OPTIONS))
    .min(1, "Select at least one specialty"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  businessName: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  email: z.string().email("Valid email required"),
  website: z.string().url().optional().or(z.literal("")),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;