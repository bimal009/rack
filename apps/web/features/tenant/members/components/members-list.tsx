"use client"

import { useState } from "react"
import {
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Input } from "@repo/ui/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table"
import { cn } from "@repo/ui/lib/utils"

type MemberStatus = "Active" | "On Hold" | "Expired"

interface Member {
  name: string
  email: string
  plan: string
  joined: string
  status: MemberStatus
}

const members: Member[] = [
  { name: "Savannah Nguyen", email: "savannah@234.com", plan: "Annual Plan", joined: "1 Feb 26", status: "Active" },
  { name: "Kathryn Murphy", email: "kathryn@114.com", plan: "Monthly Plan", joined: "2 Feb 26", status: "On Hold" },
  { name: "Courtney Henry", email: "henry@courtney.com", plan: "Quarterly Plan", joined: "15 Feb 26", status: "Active" },
  { name: "Kristin Watson", email: "kristin@gmail.com", plan: "Annual Plan", joined: "15 Feb 26", status: "Active" },
  { name: "Theresa Webb", email: "webb@gmail.com", plan: "Monthly Plan", joined: "23 Feb 26", status: "Expired" },
  { name: "Brooklyn Simmons", email: "brooklyn@moms.com", plan: "Annual Plan", joined: "25 Feb 26", status: "Active" },
  { name: "Ralph Edwards", email: "ralph@edwards.com", plan: "Quarterly Plan", joined: "25 Feb 26", status: "Expired" },
  { name: "Wade Warren", email: "naguyen@warren.com", plan: "Monthly Plan", joined: "16 Mar 26", status: "On Hold" },
  { name: "Eleanor Pena", email: "eleanor@warren.com", plan: "Annual Plan", joined: "16 Mar 26", status: "Active" },
  { name: "Marvin McKinney", email: "marvin@warren.com", plan: "Monthly Plan", joined: "20 Mar 26", status: "Active" },
  { name: "Ronald Richards", email: "ronald@warren.com", plan: "Quarterly Plan", joined: "20 Mar 26", status: "Expired" },
]

const filters = ["All", "Active", "On Hold", "Expired"] as const

const statusVariant: Record<MemberStatus, "default" | "secondary" | "destructive"> = {
  Active: "default",
  "On Hold": "secondary",
  Expired: "destructive",
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

export function MembersList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")

  const visible =
    filter === "All" ? members : members.filter((m) => m.status === filter)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 w-fit">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="rounded-full pl-9 shadow-none"
          />
        </div>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="size-4" />
        </Button>
        <div className="flex items-center rounded-lg border border-border p-1">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setView("list")}
          >
            <List className="size-4" />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
        <Button>
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox />
              </TableHead>
              <TableHead className="w-14">#No</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((m, i) => (
              <TableRow key={m.email}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  #{String(i + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                        {initials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {m.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full font-normal">
                    {m.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {m.joined}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant[m.status]}
                    className={cn(
                      "rounded-full",
                      m.status === "On Hold" && "bg-muted text-foreground"
                    )}
                  >
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Member</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
