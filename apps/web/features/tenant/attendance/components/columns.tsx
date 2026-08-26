"use client"

import { LogOut } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  createDataTableColumnHelper,
  createIndexColumn,
} from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import type { AttendanceRecord, AttendanceStatus } from "../lib/schema"

export const attendanceStatusVariant: Record<
  AttendanceStatus,
  "default" | "secondary"
> = {
  "Checked In": "default",
  "Checked Out": "secondary",
}

interface AttendanceColumnActions {
  onCheckOut: (record: AttendanceRecord) => void
}

export function createAttendanceColumns({
  onCheckOut,
}: AttendanceColumnActions) {
  const columnHelper = createDataTableColumnHelper<AttendanceRecord>()

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${row.memberName} ${row.memberEmail}`, {
      id: "member",
      header: "Member",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {row.original.memberName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.memberEmail}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("checkInAt", {
      header: "Check In",
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("checkOutAt", {
      header: "Check Out",
      enableGlobalFilter: false,
      cell: ({ getValue }) => getValue() ?? (
        <span className="text-muted-foreground">—</span>
      ),
    }),
    columnHelper.accessor("method", {
      header: "Method",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-full font-normal">
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge
            variant={attendanceStatusVariant[status]}
            className={cn(
              "rounded-full",
              status === "Checked In" && "bg-primary/10 text-primary"
            )}
          >
            {status}
          </Badge>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) =>
        row.original.status === "Checked In" ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onCheckOut(row.original)}
          >
            <LogOut className="size-3.5" />
            Check Out
          </Button>
        ) : null,
    }),
  ])
}
