import { z } from "zod"

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export const timeOffSchema = z
  .object({
    staffId: z.string().trim().min(1, "Select a staff member"),
    date: z.string().min(1, "Select a date"),
    allDay: z.boolean(),
    startTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM").optional(),
    endTime: z.string().regex(TIME_PATTERN, "Use 24-hour HH:MM").optional(),
    reason: z.string().trim().optional().or(z.literal("")),
  })
  .refine(
    (data) => data.allDay || (data.startTime && data.endTime && data.endTime > data.startTime),
    { message: "End time must be after start time", path: ["endTime"] }
  )

export type TimeOffInput = z.infer<typeof timeOffSchema>

export interface TimeOff extends TimeOffInput {
  id: string
}
