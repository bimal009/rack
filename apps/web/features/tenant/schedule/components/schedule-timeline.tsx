"use client"

import { type DragEvent } from "react"
import { Ticket } from "lucide-react"

import type { ClassSession } from "@/features/tenant/classes/lib/schema"
import { areaName } from "@/features/tenant/classes/components/columns"
import { initialAreaTypes } from "@/features/tenant/settings/types/lib/data"
import { fullName as fullMemberName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

import type { Booking } from "../lib/booking-schema"
import type { TimeOff } from "../lib/time-off-schema"
import {
  HOURS,
  HOUR_WIDTH,
  TIMELINE_LABEL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  eventLeftPx,
  eventWidthPx,
  minutesFromOffsetX,
  minutesToTime,
  timeToMinutes,
  toDateKey,
} from "../lib/schedule-utils"

const instructors = initialStaff.filter((s) => s.role === "Instructor")

function formatHour(hour: number) {
  const period = hour < 12 ? "AM" : "PM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12} ${period}`
}

type TimelineDragPayload =
  | { kind: "class"; id: string; grabOffsetX: number }
  | { kind: "booking"; id: string; grabOffsetX: number }
  | { kind: "timeOff"; id: string }

function startTimelineDrag(
  event: DragEvent<HTMLDivElement>,
  payload: { kind: "class" | "booking"; id: string }
) {
  const rect = event.currentTarget.getBoundingClientRect()
  const grabOffsetX = event.clientX - rect.left
  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({ ...payload, grabOffsetX })
  )
}

interface ScheduleTimelineProps {
  day: Date
  classes: ClassSession[]
  bookings: Booking[]
  timeOff: TimeOff[]
  onEditClass: (cls: ClassSession) => void
  onEditBooking: (booking: Booking) => void
  onEditTimeOff: (off: TimeOff) => void
  onRescheduleClass: (
    id: string,
    patch: { startTime: string; endTime: string; instructorId: string }
  ) => void
  onRescheduleBooking: (
    id: string,
    patch: { startTime: string; endTime: string; areaId: string }
  ) => void
  onReassignTimeOff: (id: string, staffId: string) => void
}

export function ScheduleTimeline({
  day,
  classes,
  bookings,
  timeOff,
  onEditClass,
  onEditBooking,
  onEditTimeOff,
  onRescheduleClass,
  onRescheduleBooking,
  onReassignTimeOff,
}: ScheduleTimelineProps) {
  const dateKey = toDateKey(day)
  const timelineWidth = HOURS.length * HOUR_WIDTH

  function handleInstructorDrop(
    event: DragEvent<HTMLDivElement>,
    instructorId: string
  ) {
    event.preventDefault()
    const raw = event.dataTransfer.getData("text/plain")
    if (!raw) return
    const payload = JSON.parse(raw) as TimelineDragPayload

    if (payload.kind === "class") {
      const cls = classes.find((c) => c.id === payload.id)
      if (!cls) return
      const rect = event.currentTarget.getBoundingClientRect()
      const offsetX = event.clientX - rect.left - payload.grabOffsetX
      const duration = timeToMinutes(cls.endTime) - timeToMinutes(cls.startTime)
      const newStartMinutes = minutesFromOffsetX(offsetX)
      const newStart = minutesToTime(newStartMinutes)
      const newEnd = minutesToTime(newStartMinutes + duration)
      onRescheduleClass(cls.id, {
        startTime: newStart,
        endTime: newEnd,
        instructorId,
      })
    } else if (payload.kind === "timeOff") {
      onReassignTimeOff(payload.id, instructorId)
    }
  }

  function handleAreaDrop(event: DragEvent<HTMLDivElement>, areaId: string) {
    event.preventDefault()
    const raw = event.dataTransfer.getData("text/plain")
    if (!raw) return
    const payload = JSON.parse(raw) as TimelineDragPayload
    if (payload.kind !== "booking") return

    const booking = bookings.find((b) => b.id === payload.id)
    if (!booking) return
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - payload.grabOffsetX
    const duration =
      timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime)
    const newStartMinutes = minutesFromOffsetX(offsetX)
    const newStart = minutesToTime(newStartMinutes)
    const newEnd = minutesToTime(newStartMinutes + duration)
    onRescheduleBooking(booking.id, {
      startTime: newStart,
      endTime: newEnd,
      areaId,
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex" style={{ minWidth: TIMELINE_LABEL_WIDTH + timelineWidth }}>
        <div
          className="sticky left-0 z-20 shrink-0 border-r border-b border-border bg-background"
          style={{ width: TIMELINE_LABEL_WIDTH }}
        />
        <div className="flex border-b border-border">
          {HOURS.map((hour) => (
            <div
              key={hour}
              style={{ width: HOUR_WIDTH }}
              className="shrink-0 border-r border-border px-2 py-2 text-[0.65rem] font-medium text-muted-foreground"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-border px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
        Instructors
      </div>

      {instructors.map((staff) => {
        const rowClasses = classes.filter(
          (c) => c.date === dateKey && c.instructorId === staff.id
        )
        const rowTimeOff = timeOff.filter(
          (o) => o.date === dateKey && o.staffId === staff.id
        )

        return (
          <div
            key={staff.id}
            className="flex"
            style={{ minWidth: TIMELINE_LABEL_WIDTH + timelineWidth }}
          >
            <div
              className="sticky left-0 z-10 flex shrink-0 items-center border-r border-b border-border bg-background px-3"
              style={{ width: TIMELINE_LABEL_WIDTH, height: TIMELINE_ROW_HEIGHT }}
            >
              <p className="truncate text-sm font-medium text-foreground">
                {fullName(staff)}
              </p>
            </div>

            <div
              className="relative border-b border-border"
              style={{ width: timelineWidth, height: TIMELINE_ROW_HEIGHT }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInstructorDrop(e, staff.id)}
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{ width: HOUR_WIDTH }}
                  className="absolute inset-y-0 border-r border-border"
                  data-hour={hour}
                />
              ))}

              {rowTimeOff.map((off) => (
                <div
                  key={off.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify({ kind: "timeOff", id: off.id })
                    )
                  }
                  onClick={() => onEditTimeOff(off)}
                  className="absolute inset-y-1 z-10 flex w-full cursor-grab items-center gap-1.5 rounded-lg border border-dashed border-muted-foreground/30 px-2.5 text-xs shadow-sm transition-all hover:shadow-md active:cursor-grabbing"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, var(--color-muted) 0 6px, transparent 6px 12px)",
                  }}
                >
                  <span className="truncate font-medium text-foreground">
                    {off.allDay ? "All day" : `${off.startTime}–${off.endTime}`}
                    {off.reason ? ` · ${off.reason}` : ""}
                  </span>
                </div>
              ))}

              {rowClasses.map((cls) => {
                const color = cls.color ?? "#3b82f6"
                const width = eventWidthPx(cls.startTime, cls.endTime)
                return (
                  <div
                    key={cls.id}
                    draggable
                    onDragStart={(e) =>
                      startTimelineDrag(e, { kind: "class", id: cls.id })
                    }
                    onClick={() => onEditClass(cls)}
                    style={{
                      left: eventLeftPx(cls.startTime),
                      width,
                      backgroundColor: `${color}1a`,
                      borderColor: `${color}80`,
                    }}
                    className="absolute inset-y-1 z-10 flex cursor-grab flex-col justify-center overflow-hidden rounded-lg border border-l-[3px] px-2.5 shadow-sm transition-all hover:z-20 hover:shadow-md active:cursor-grabbing"
                  >
                    <p
                      className="truncate text-[0.75rem] leading-tight font-semibold"
                      style={{ color }}
                    >
                      {cls.name}
                    </p>
                    {width >= 90 && (
                      <p className="truncate text-[0.7rem] leading-tight font-medium text-foreground/70">
                        {cls.startTime}–{cls.endTime}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="border-b border-border px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
        Areas
      </div>

      {initialAreaTypes.map((area) => {
        const rowBookings = bookings.filter(
          (b) => b.date === dateKey && b.areaId === area.id
        )

        return (
          <div
            key={area.id}
            className="flex"
            style={{ minWidth: TIMELINE_LABEL_WIDTH + timelineWidth }}
          >
            <div
              className="sticky left-0 z-10 flex shrink-0 items-center border-r border-b border-border bg-background px-3"
              style={{ width: TIMELINE_LABEL_WIDTH, height: TIMELINE_ROW_HEIGHT }}
            >
              <p className="truncate text-sm font-medium text-foreground">
                {area.name}
              </p>
            </div>

            <div
              className="relative border-b border-border"
              style={{ width: timelineWidth, height: TIMELINE_ROW_HEIGHT }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleAreaDrop(e, area.id)}
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{ width: HOUR_WIDTH }}
                  className="absolute inset-y-0 border-r border-border"
                  data-hour={hour}
                />
              ))}

              {rowBookings.map((booking) => {
                const member = initialMembers.find(
                  (m) => m.id === booking.memberId
                )
                const width = eventWidthPx(booking.startTime, booking.endTime)
                return (
                  <div
                    key={booking.id}
                    draggable
                    onDragStart={(e) =>
                      startTimelineDrag(e, { kind: "booking", id: booking.id })
                    }
                    onClick={() => onEditBooking(booking)}
                    style={{
                      left: eventLeftPx(booking.startTime),
                      width,
                    }}
                    className="absolute inset-y-1 z-10 flex cursor-grab flex-col justify-center overflow-hidden rounded-lg border border-l-[3px] border-primary/40 bg-primary/10 px-2.5 shadow-sm transition-all hover:z-20 hover:shadow-md active:cursor-grabbing"
                  >
                    <p className="flex items-center gap-1 truncate text-[0.75rem] leading-tight font-semibold text-primary">
                      <Ticket className="size-3 shrink-0" />
                      {member ? fullMemberName(member) : "Booking"}
                    </p>
                    {width >= 90 && (
                      <p className="truncate text-[0.7rem] leading-tight font-medium text-foreground/70">
                        {booking.startTime}–{booking.endTime}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
