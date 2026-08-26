"use client"

import { useState, type DragEvent } from "react"
import { CalendarOff, ChevronLeft, ChevronRight, Eye, MoreVertical, Ticket } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { cn } from "@repo/ui/lib/utils"

import { generateClassId, initialClasses } from "@/features/tenant/classes/lib/data"
import { classSchema, type ClassInput, type ClassSession } from "@/features/tenant/classes/lib/schema"
import { ClassFormSheet } from "@/features/tenant/classes/components/class-form-sheet"
import { areaName, instructorName } from "@/features/tenant/classes/components/columns"
import { fullName as fullMemberName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

import { generateBookingId, initialBookings } from "../lib/booking-data"
import type { Booking, BookingInput } from "../lib/booking-schema"
import { generateTimeOffId, initialTimeOff } from "../lib/time-off-data"
import type { TimeOff, TimeOffInput } from "../lib/time-off-schema"
import {
  HOURS,
  ROW_HEIGHT,
  addDays,
  eventHeightPx,
  eventTopPx,
  formatDateRange,
  isSameDay,
  minutesFromOffsetY,
  minutesToTime,
  startOfWeek,
  timeToMinutes,
  toDateKey,
} from "../lib/schedule-utils"
import { BookingFormSheet } from "./booking-form-sheet"
import { ScheduleCreatorMenu } from "./schedule-creator-menu"
import { TimeOffFormSheet } from "./time-off-form-sheet"

const viewOptions = [
  { label: "Day", days: 1, enabled: true },
  { label: "Timeline", days: 0, enabled: false },
  { label: "3 days", days: 3, enabled: true },
  { label: "Week", days: 7, enabled: true },
] as const

type DragPayload =
  | { kind: "class"; id: string; grabOffsetY: number }
  | { kind: "timeOff"; id: string }
  | { kind: "booking"; id: string; grabOffsetY: number }

function startEventDrag(
  event: DragEvent<HTMLDivElement>,
  payload: { kind: "class" | "booking"; id: string }
) {
  const rect = event.currentTarget.getBoundingClientRect()
  const grabOffsetY = event.clientY - rect.top
  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({ ...payload, grabOffsetY })
  )
}

function formatHour(hour: number) {
  const period = hour < 12 ? "AM" : "PM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12} ${period}`
}

export function ScheduleView() {
  const [viewLabel, setViewLabel] = useState<(typeof viewOptions)[number]["label"]>("Week")
  const [anchor, setAnchor] = useState(() => new Date())
  const [classes, setClasses] = useState<ClassSession[]>(initialClasses)
  const [timeOff, setTimeOff] = useState<TimeOff[]>(initialTimeOff)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  const [classSheetOpen, setClassSheetOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null)

  const [timeOffSheetOpen, setTimeOffSheetOpen] = useState(false)
  const [editingTimeOff, setEditingTimeOff] = useState<TimeOff | null>(null)

  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  const view = viewOptions.find((v) => v.label === viewLabel)!
  const rangeStart = viewLabel === "Week" ? startOfWeek(anchor) : anchor
  const days = Array.from({ length: view.days || 7 }, (_, i) =>
    addDays(rangeStart, i)
  )
  const today = new Date()

  function goToday() {
    setAnchor(new Date())
  }

  function goPrev() {
    setAnchor((d) => addDays(d, -(view.days || 7)))
  }

  function goNext() {
    setAnchor((d) => addDays(d, view.days || 7))
  }

  function openAddClass() {
    setEditingClass(null)
    setClassSheetOpen(true)
  }

  function openEditClass(cls: ClassSession) {
    setEditingClass(cls)
    setClassSheetOpen(true)
  }

  function handleClassSubmit(values: ClassInput) {
    if (editingClass) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editingClass.id ? { ...c, ...values } : c))
      )
      toast.success(`${values.name} updated`)
    } else {
      setClasses((prev) => [
        { ...values, id: generateClassId(), status: "Scheduled" },
        ...prev,
      ])
      toast.success(`${values.name} scheduled`)
    }
  }

  function openAddTimeOff() {
    setEditingTimeOff(null)
    setTimeOffSheetOpen(true)
  }

  function openEditTimeOff(off: TimeOff) {
    setEditingTimeOff(off)
    setTimeOffSheetOpen(true)
  }

  function handleTimeOffSubmit(values: TimeOffInput) {
    if (editingTimeOff) {
      setTimeOff((prev) =>
        prev.map((o) => (o.id === editingTimeOff.id ? { ...o, ...values } : o))
      )
      toast.success("Time off updated")
    } else {
      setTimeOff((prev) => [
        { ...values, id: generateTimeOffId() },
        ...prev,
      ])
      toast.success("Time off added")
    }
  }

  function openAddBooking() {
    setEditingBooking(null)
    setBookingSheetOpen(true)
  }

  function openEditBooking(booking: Booking) {
    setEditingBooking(booking)
    setBookingSheetOpen(true)
  }

  function handleBookingSubmit(values: BookingInput) {
    if (editingBooking) {
      setBookings((prev) =>
        prev.map((b) => (b.id === editingBooking.id ? { ...b, ...values } : b))
      )
      toast.success("Booking updated")
    } else {
      setBookings((prev) => [
        { ...values, id: generateBookingId() },
        ...prev,
      ])
      toast.success("Booking added")
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, day: Date) {
    event.preventDefault()
    const raw = event.dataTransfer.getData("text/plain")
    if (!raw) return
    const payload = JSON.parse(raw) as DragPayload
    const dateKey = toDateKey(day)

    if (payload.kind === "class") {
      const cls = classes.find((c) => c.id === payload.id)
      if (!cls) return
      const rect = event.currentTarget.getBoundingClientRect()
      const offsetY = event.clientY - rect.top - payload.grabOffsetY
      const duration = timeToMinutes(cls.endTime) - timeToMinutes(cls.startTime)
      const newStartMinutes = minutesFromOffsetY(offsetY)
      const newStart = minutesToTime(newStartMinutes)
      const newEnd = minutesToTime(newStartMinutes + duration)

      const parsed = classSchema.safeParse({
        ...cls,
        date: dateKey,
        startTime: newStart,
        endTime: newEnd,
      })
      if (!parsed.success) return

      setClasses((prev) =>
        prev.map((c) =>
          c.id === cls.id
            ? { ...c, date: dateKey, startTime: newStart, endTime: newEnd }
            : c
        )
      )
    } else if (payload.kind === "booking") {
      const booking = bookings.find((b) => b.id === payload.id)
      if (!booking) return
      const rect = event.currentTarget.getBoundingClientRect()
      const offsetY = event.clientY - rect.top - payload.grabOffsetY
      const duration =
        timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime)
      const newStartMinutes = minutesFromOffsetY(offsetY)
      const newStart = minutesToTime(newStartMinutes)
      const newEnd = minutesToTime(newStartMinutes + duration)

      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, date: dateKey, startTime: newStart, endTime: newEnd }
            : b
        )
      )
    } else {
      setTimeOff((prev) =>
        prev.map((o) => (o.id === payload.id ? { ...o, date: dateKey } : o))
      )
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={goToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={goPrev}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={goNext}>
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            {formatDateRange(rangeStart, days.length)}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          {viewOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              disabled={!option.enabled}
              onClick={() => option.enabled && setViewLabel(option.label)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                !option.enabled && "cursor-not-allowed text-muted-foreground/40",
                option.enabled && viewLabel === option.label
                  ? "bg-primary text-primary-foreground"
                  : option.enabled && "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon">
            <Eye className="size-4" />
          </Button>
          <ScheduleCreatorMenu
            onCreateBooking={openAddBooking}
            onCreateClass={() => openAddClass()}
            onCreateTimeOff={openAddTimeOff}
          />
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-auto">
        <div className="w-14 shrink-0 border-r border-border">
          <div className="h-14 border-b border-border" />
          {HOURS.map((hour) => (
            <div
              key={hour}
              style={{ height: ROW_HEIGHT }}
              className="border-b border-border px-1.5 pt-1 text-right text-[0.65rem] font-medium text-muted-foreground"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dateKey = toDateKey(day)
          const dayClasses = classes.filter((c) => c.date === dateKey)
          const dayTimeOff = timeOff.filter((o) => o.date === dateKey)
          const dayBookings = bookings.filter((b) => b.date === dateKey)
          const isToday = isSameDay(day, today)

          return (
            <div key={dateKey} className="min-w-36 flex-1 border-r border-border">
              <div className="flex h-14 flex-col items-center justify-center border-b border-border">
                <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-sm font-medium",
                    isToday && "bg-primary text-primary-foreground"
                  )}
                >
                  {day.getDate()}
                </span>
              </div>

              <div
                className="relative"
                style={{ height: HOURS.length * ROW_HEIGHT }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, day)}
              >
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: ROW_HEIGHT }}
                    className="border-b border-border"
                  />
                ))}

                {dayTimeOff.map((off) => (
                  <div
                    key={off.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "text/plain",
                        JSON.stringify({ kind: "timeOff", id: off.id })
                      )
                    }
                    onClick={() => openEditTimeOff(off)}
                    className="absolute inset-x-1 top-1 z-10 flex cursor-grab items-center gap-1.5 rounded-lg border border-dashed border-muted-foreground/30 px-2.5 py-1.5 text-xs shadow-sm transition-all hover:shadow-md active:cursor-grabbing"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, var(--color-muted) 0 6px, transparent 6px 12px)",
                    }}
                  >
                    <CalendarOff className="size-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-[0.75rem] leading-tight font-medium text-foreground">
                        {fullName(
                          initialStaff.find((s) => s.id === off.staffId) ?? {
                            firstName: "",
                            lastName: "",
                          }
                        )}
                      </p>
                      <p className="truncate text-[0.7rem] leading-tight text-muted-foreground">
                        {off.allDay
                          ? "All day"
                          : `${off.startTime}–${off.endTime}`}
                      </p>
                    </div>
                  </div>
                ))}

                {dayClasses.map((cls) => {
                  const color = cls.color ?? "#3b82f6"
                  const height = eventHeightPx(cls.startTime, cls.endTime)
                  return (
                    <div
                      key={cls.id}
                      draggable
                      onDragStart={(e) =>
                        startEventDrag(e, { kind: "class", id: cls.id })
                      }
                      onClick={() => openEditClass(cls)}
                      style={{
                        top: eventTopPx(cls.startTime),
                        height,
                        backgroundColor: `${color}1a`,
                        borderColor: `${color}80`,
                      }}
                      className="absolute inset-x-1 z-10 flex cursor-grab flex-col overflow-hidden rounded-lg border border-l-[3px] px-2.5 py-1 shadow-sm transition-all hover:z-20 hover:shadow-md active:cursor-grabbing"
                    >
                      <p
                        className="truncate text-[0.75rem] leading-tight font-semibold"
                        style={{ color }}
                      >
                        {cls.name}
                      </p>
                      <p className="truncate text-[0.7rem] leading-tight font-medium text-foreground/70">
                        {cls.startTime}–{cls.endTime}
                      </p>
                      {height >= 46 && (
                        <p className="truncate text-[0.7rem] leading-tight text-muted-foreground">
                          {instructorName(cls.instructorId)}
                        </p>
                      )}
                    </div>
                  )
                })}

                {dayBookings.map((booking) => {
                  const member = initialMembers.find(
                    (m) => m.id === booking.memberId
                  )
                  const height = eventHeightPx(booking.startTime, booking.endTime)
                  return (
                    <div
                      key={booking.id}
                      draggable
                      onDragStart={(e) =>
                        startEventDrag(e, { kind: "booking", id: booking.id })
                      }
                      onClick={() => openEditBooking(booking)}
                      style={{
                        top: eventTopPx(booking.startTime),
                        height,
                      }}
                      className="absolute inset-x-1 z-10 flex cursor-grab flex-col overflow-hidden rounded-lg border border-l-[3px] border-primary/40 bg-primary/10 px-2.5 py-1 shadow-sm transition-all hover:z-20 hover:shadow-md active:cursor-grabbing"
                    >
                      <p className="flex items-center gap-1 truncate text-[0.75rem] leading-tight font-semibold text-primary">
                        <Ticket className="size-3 shrink-0" />
                        {member ? fullMemberName(member) : "Booking"}
                      </p>
                      <p className="truncate text-[0.7rem] leading-tight font-medium text-foreground/70">
                        {booking.startTime}–{booking.endTime}
                      </p>
                      {height >= 46 && (
                        <p className="truncate text-[0.7rem] leading-tight text-muted-foreground">
                          {areaName(booking.areaId)}
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

      <ClassFormSheet
        open={classSheetOpen}
        onOpenChange={setClassSheetOpen}
        cls={editingClass}
        onSubmit={handleClassSubmit}
      />

      <TimeOffFormSheet
        open={timeOffSheetOpen}
        onOpenChange={setTimeOffSheetOpen}
        timeOff={editingTimeOff}
        onSubmit={handleTimeOffSubmit}
      />

      <BookingFormSheet
        open={bookingSheetOpen}
        onOpenChange={setBookingSheetOpen}
        booking={editingBooking}
        onSubmit={handleBookingSubmit}
      />
    </div>
  )
}
