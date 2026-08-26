import { z } from "zod"

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export const bookingSchema = z
  .object({
    memberId: z.string().trim().min(1, "Select a member"),
    areaId: z.string().trim().min(1, "Select an area"),
    date: z.string().min(1, "Select a date"),
    startTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    endTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM"),
    notes: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })

export type BookingInput = z.infer<typeof bookingSchema>

export interface Booking extends BookingInput {
  id: string
}
