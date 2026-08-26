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

export const CURRENCY_OPTIONS = ["NPR", "USD", "INR", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCY_OPTIONS)[number];

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const timeRangeSchema = z
  .object({
    open: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    close: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
  })
  .refine((range) => range.close > range.open, {
    message: "Closing time must be after opening time",
    path: ["close"],
  });

export type TimeRange = z.infer<typeof timeRangeSchema>;

export const dayScheduleSchema = z.object({
  closed: z.boolean(),
  ranges: z.array(timeRangeSchema),
});

export type DaySchedule = z.infer<typeof dayScheduleSchema>;

export const openingHoursSchema = z.object({
  Monday: dayScheduleSchema,
  Tuesday: dayScheduleSchema,
  Wednesday: dayScheduleSchema,
  Thursday: dayScheduleSchema,
  Friday: dayScheduleSchema,
  Saturday: dayScheduleSchema,
  Sunday: dayScheduleSchema,
});

export type OpeningHours = z.infer<typeof openingHoursSchema>;

export const DEFAULT_OPENING_HOURS: OpeningHours = WEEKDAYS.reduce(
  (acc, day) => {
    acc[day] =
      day === "Sunday"
        ? { closed: true, ranges: [] }
        : { closed: false, ranges: [{ open: "06:00", close: "22:00" }] };
    return acc;
  },
  {} as OpeningHours
);

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
  openingHours: openingHoursSchema,
}).strict();

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const updateGymSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .regex(/^(98|97)\d{8}$/, "Phone number must be 10 digits starting with 98 or 97"),
  email: z.string().email("Valid email required"),
  website: z.string().url().optional().or(z.literal("")),
  currency: z.enum(CURRENCY_OPTIONS),
  openingHours: openingHoursSchema,
}).strict();

export type UpdateGymInput = z.infer<typeof updateGymSchema>;

export interface GymRecord {
  id: string;
  slug: string;
  businessType: string;
  businessName: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  currency: Currency;
  openingHours: OpeningHours;
  createdAt: string;
  updatedAt: string;
}
