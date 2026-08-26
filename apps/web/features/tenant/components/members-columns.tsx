"use client"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

export type MemberStatus = "Active" | "On Hold" | "Expired"

export interface RecentMember {
  name: string
  plan: string
  status: MemberStatus
  joined: string
}

const statusVariant: Record<
  MemberStatus,
  "default" | "secondary" | "destructive"
> = {
  Active: "default",
  "On Hold": "secondary",
  Expired: "destructive",
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

const columnHelper = createDataTableColumnHelper<RecentMember>()

export const recentMemberColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Member",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
            {initials(getValue())}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground">{getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("plan", {
    header: "Plan",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={statusVariant[getValue()]} className="rounded-full">
        {getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("joined", {
    header: () => <div className="text-right">Joined</div>,
    cell: ({ getValue }) => (
      <div className="text-right text-muted-foreground">{getValue()}</div>
    ),
  }),
])
