import { initialStaff } from "@/features/tenant/staff/lib/data"

import type { ClassSession } from "./schema"

const instructor1 = initialStaff.find((s) => s.role === "Instructor")
const instructor2 = initialStaff.filter((s) => s.role === "Instructor")[1]

export const initialClasses: ClassSession[] = [
  {
    id: "cls_1",
    name: "Morning Yoga Flow",
    classType: "Yoga Flow",
    price: 500,
    maxCapacity: 20,
    visibility: "Public",
    instructorId: instructor1?.id ?? "",
    areaId: "area_1",
    date: "2026-08-28",
    startTime: "07:00",
    endTime: "08:00",
    repeat: true,
    repeatEvery: 1,
    repeatFrequency: "Week",
    repeatEndMode: "Never",
    color: "#3b82f6",
    sport: "Yoga",
    description: "All-levels vinyasa flow to start the day.",
    notes: "",
    status: "Scheduled",
  },
  {
    id: "cls_2",
    name: "CrossFit WOD",
    classType: "CrossFit WOD",
    price: 700,
    maxCapacity: 15,
    visibility: "Public",
    instructorId: instructor2?.id ?? "",
    areaId: "area_2",
    date: "2026-08-28",
    startTime: "18:00",
    endTime: "19:00",
    repeat: true,
    repeatEvery: 1,
    repeatFrequency: "Day",
    repeatEndMode: "Never",
    color: "#ef4444",
    sport: "CrossFit",
    description: "Daily workout of the day.",
    notes: "",
    status: "Scheduled",
  },
  {
    id: "cls_3",
    name: "Beginner Boxing",
    classType: "",
    price: 600,
    maxCapacity: 12,
    visibility: "Public",
    instructorId: instructor2?.id ?? "",
    areaId: "area_2",
    date: "2026-08-29",
    startTime: "17:00",
    endTime: "18:00",
    repeat: false,
    color: "#f59e0b",
    sport: "Boxing",
    description: "Intro to boxing fundamentals.",
    notes: "First class of the month, expect a full room.",
    status: "Scheduled",
  },
]

export function generateClassId() {
  return `cls_${Math.random().toString(36).slice(2, 10)}`
}
