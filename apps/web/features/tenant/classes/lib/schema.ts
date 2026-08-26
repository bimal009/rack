import { z } from "zod"

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export const classVisibilities = ["Public", "Private", "Hidden"] as const
export type ClassVisibility = (typeof classVisibilities)[number]

export const repeatFrequencies = ["Day", "Week", "Month"] as const
export type RepeatFrequency = (typeof repeatFrequencies)[number]

export const repeatEndModes = ["Until date", "After occurrences", "Never"] as const
export type RepeatEndMode = (typeof repeatEndModes)[number]

export const classStatuses = ["Scheduled", "Cancelled"] as const
export type ClassStatus = (typeof classStatuses)[number]

export const classSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a class name"),
    classType: z.string().trim().optional().or(z.literal("")),
    price: z.number().nonnegative(),
    maxCapacity: z.number().int().positive().optional(),
    visibility: z.enum(classVisibilities),
    instructorId: z.string().trim().optional().or(z.literal("")),
    areaId: z.string().trim().optional().or(z.literal("")),
    date: z.string().min(1, "Select a date"),
    startTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    endTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    repeat: z.boolean(),
    repeatEvery: z.number().int().positive().optional(),
    repeatFrequency: z.enum(repeatFrequencies).optional(),
    repeatEndMode: z.enum(repeatEndModes).optional(),
    repeatEndDate: z.string().optional().or(z.literal("")),
    repeatEndOccurrences: z.number().int().positive().optional(),
    color: z.string().trim().optional().or(z.literal("")),
    sport: z.string().trim().optional().or(z.literal("")),
    description: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })

export type ClassInput = z.infer<typeof classSchema>

export interface ClassSession extends ClassInput {
  id: string
  status: ClassStatus
}
