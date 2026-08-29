"use client"

import type { StaffWithUser } from "@repo/types"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import {
  createDataTableColumnHelper,
  createIndexColumn,
} from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import { gymRoleLabel } from "../lib/roles"

const joinedFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "2-digit",
})

const payCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

function payLabel(row: StaffWithUser) {
  if (row.payRate == null || !row.payType) return null
  const suffix =
    row.payType === "Hourly"
      ? "/hr"
      : row.payType === "Per Class"
        ? "/class"
        : "/mo"
  return `${payCurrency.format(row.payRate)}${suffix}`
}

export function createStaffDirectoryColumns() {
  const columnHelper = createDataTableColumnHelper<StaffWithUser>()

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${row.user.name} ${row.user.email}`, {
      id: "staff",
      header: "Staff",
      cell: ({ row }) => {
        const { name, email, image } = row.original.user
        return (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarImage src={image ?? undefined} alt="" />
              <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                {initialsFromName(name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {name}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-full font-normal">
          {gymRoleLabel(getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor("payRate", {
      header: "Pay Rate",
      cell: ({ row }) => {
        const label = payLabel(row.original)
        return label ? (
          <span className="text-foreground">{label}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Joined",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {joinedFormatter.format(new Date(getValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      cell: ({ getValue }) => {
        const active = getValue()
        return (
          <Badge
            variant={active ? "default" : "secondary"}
            className={cn("rounded-full", !active && "bg-muted text-foreground")}
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        )
      },
    }),
  ])
}
