import { Clock3, Dumbbell, Flame, HandFist, PersonStanding } from "lucide-react"

const schedule = [
  {
    title: "Yoga Flow",
    detail: "6:00 AM · Trainer: Anita Rao",
    icon: PersonStanding,
  },
  {
    title: "HIIT Blast",
    detail: "7:30 AM · Trainer: Marcus Lee",
    icon: Flame,
  },
  {
    title: "Spin Class",
    detail: "5:30 PM · Trainer: Dana Cruz",
    icon: Dumbbell,
  },
  {
    title: "Boxing Basics",
    detail: "6:45 PM · Trainer: Omar Faye",
    icon: HandFist,
  },
]

export function TodaysScheduleList() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Today&apos;s Schedule
        </h2>
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          See Details
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {schedule.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
            <Clock3 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  )
}
