import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table"

type MemberStatus = "Active" | "On Hold" | "Expired"

const members: {
  name: string
  plan: string
  status: MemberStatus
  joined: string
}[] = [
  { name: "Priya Natarajan", plan: "Annual Plan", status: "Active", joined: "24 Aug 26" },
  { name: "Honorato Imogene Curry", plan: "Annual Plan", status: "Active", joined: "22 Aug 26" },
  { name: "Maisha Lucy Zamora Gon", plan: "Quarterly Plan", status: "Active", joined: "20 Aug 26" },
  { name: "Thomas Goodman", plan: "Monthly Plan", status: "On Hold", joined: "18 Aug 26" },
  { name: "Jonathan Ibrahim Sheikh", plan: "Monthly Plan", status: "Expired", joined: "15 Aug 26" },
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

const statusVariant: Record<MemberStatus, "default" | "secondary" | "destructive"> = {
  Active: "default",
  "On Hold": "secondary",
  Expired: "destructive",
}

export function MembersTable() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Recent Members
          </h2>
          <p className="text-xs text-muted-foreground">Latest sign-ups</p>
        </div>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          View All
        </Button>
      </div>

      <div className="mt-4 flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m, i) => (
              <TableRow key={m.name}>
                <TableCell className="text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                        {initials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {m.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {m.plan}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[m.status]} className="rounded-full">
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {m.joined}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
