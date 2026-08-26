const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export function nowTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

export function today() {
  return formatDate(new Date())
}
