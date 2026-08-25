import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { cn } from "@repo/ui/lib/utils"

type Status = "Expiring" | "Renewed" | "Overdue"

const members: {
  name: string
  plan: string
  date: string
  status: Status
}[] = [
  { name: "Maisha Lucy Fonzales", plan: "Annual Plan", date: "28 Aug", status: "Expiring" },
  { name: "Jonathan Ibrahim Sheikh", plan: "Monthly Plan", date: "30 Aug", status: "Overdue" },
  { name: "Thomas Goodman", plan: "Quarterly Plan", date: "02 Sep", status: "Renewed" },
  { name: "Priya Natarajan", plan: "Annual Plan", date: "04 Sep", status: "Expiring" },
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

const statusVariant: Record<Status, "default" | "secondary" | "destructive"> = {
  Expiring: "secondary",
  Renewed: "default",
  Overdue: "destructive",
}

export function MembershipEndingList() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Memberships Ending Soon
        </h2>
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          See Details
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                {initials(m.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {m.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {m.plan} · Ends {m.date}
              </p>
            </div>
            <Badge
              variant={statusVariant[m.status]}
              className={cn(
                "rounded-full",
                m.status === "Expiring" && "bg-muted text-foreground"
              )}
            >
              {m.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
