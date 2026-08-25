"use client"

import { Download, ListFilter, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
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
  { name: "Honorato Imogene Curry", plan: "Annual Plan", status: "Active", joined: "22 Aug 24" },
  { name: "Jonathan Ibrahim Sheikh", plan: "Monthly Plan", status: "Expired", joined: "30 Nov 23" },
  { name: "Maisha Lucy Zamora Gon", plan: "Quarterly Plan", status: "Active", joined: "22 Aug 24" },
  { name: "Thomas Goodman", plan: "Monthly Plan", status: "On Hold", joined: "14 Jun 24" },
  { name: "Priya Natarajan", plan: "Annual Plan", status: "Active", joined: "02 Feb 25" },
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Members</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-8 w-40 pl-8 text-sm shadow-none"
            />
          </div>
          <Button variant="outline" size="sm">
            <ListFilter className="size-3.5" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
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
