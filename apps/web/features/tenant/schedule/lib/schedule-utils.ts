export const START_HOUR = 5
export const END_HOUR = 23
export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
)
export const ROW_HEIGHT = 64

export function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function isSameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b)
}

export function formatDateRange(start: Date, days: number) {
  const end = addDays(start, days - 1)
  const startLabel = start.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  })
  const endLabel = end.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return `${startLabel} – ${endLabel}`
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number) {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, minutes))
  const h = Math.floor(clamped / 60)
  const m = clamped % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export function snapToHalfHour(minutes: number) {
  return Math.round(minutes / 30) * 30
}

const gridStartMinutes = START_HOUR * 60
const gridEndMinutes = (END_HOUR + 1) * 60
const gridTotalMinutes = gridEndMinutes - gridStartMinutes

export function eventTopPx(startTime: string) {
  const offset = timeToMinutes(startTime) - gridStartMinutes
  return (offset / gridTotalMinutes) * (HOURS.length * ROW_HEIGHT)
}

export function eventHeightPx(startTime: string, endTime: string) {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime)
  return Math.max(28, (duration / gridTotalMinutes) * (HOURS.length * ROW_HEIGHT))
}

export function minutesFromOffsetY(offsetY: number) {
  const fraction = offsetY / (HOURS.length * ROW_HEIGHT)
  const minutes = gridStartMinutes + fraction * gridTotalMinutes
  return snapToHalfHour(minutes)
}
