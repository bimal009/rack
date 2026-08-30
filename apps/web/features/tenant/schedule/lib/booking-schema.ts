import { z } from "zod"

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export const repeatFrequencies = ["Day", "Week", "Month"] as const
export type RepeatFrequency = (typeof repeatFrequencies)[number]

export const repeatEndModes = ["Never", "Until date", "After occurrences"] as const
export type RepeatEndMode = (typeof repeatEndModes)[number]

export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const
export type Weekday = (typeof weekdays)[number]

export const bookingSchema = z
  .object({
    memberId: z.string().trim().min(1, "Select a member"),
    areaId: z.string().trim().min(1, "Select an area"),
    date: z.string().min(1, "Select a date"),
    startTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    endTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    notes: z.string().trim().optional().or(z.literal("")),
    repeat: z.boolean().optional(),
    repeatEvery: z.number().int().positive().optional(),
    repeatFrequency: z.enum(repeatFrequencies).optional(),
    repeatWeekdays: z.array(z.enum(weekdays)).optional(),
    repeatEndMode: z.enum(repeatEndModes).optional(),
    repeatEndDate: z.string().optional().or(z.literal("")),
    repeatEndOccurrences: z.number().int().positive().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })

export type BookingInput = z.infer<typeof bookingSchema>

export interface Booking extends BookingInput {
  id: string
}
