"use client"

import { MoreHorizontal } from "lucide-react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import {
  createDataTableColumnHelper,
  createIndexColumn,
  createSelectionColumn,
} from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { cn } from "@repo/ui/lib/utils"

export type MemberStatus = "Active" | "On Hold" | "Expired"

export interface Member {
  name: string
  email: string
  plan: string
  joined: string
  status: MemberStatus
}

export const statusVariant: Record<
  MemberStatus,
  "default" | "secondary" | "destructive"
> = {
  Active: "default",
  "On Hold": "secondary",
  Expired: "destructive",
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

const columnHelper = createDataTableColumnHelper<Member>()

export const memberColumns = columnHelper.columns([
  createSelectionColumn(columnHelper),
  createIndexColumn(columnHelper),
  columnHelper.accessor((row) => `${row.name} ${row.email}`, {
    id: "member",
    header: "Member",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
            {initials(row.original.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {row.original.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.email}
          </p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("plan", {
    header: "Plan",
    enableGlobalFilter: false,
    cell: ({ getValue }) => (
      <Badge variant="outline" className="rounded-full font-normal">
        {getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("joined", {
    header: "Join Date",
    enableGlobalFilter: false,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableGlobalFilter: false,
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge
          variant={statusVariant[status]}
          className={cn(
            "rounded-full",
            status === "On Hold" && "bg-muted text-foreground"
          )}
        >
          {status}
        </Badge>
      )
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: () => (
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
    ),
  }),
])
