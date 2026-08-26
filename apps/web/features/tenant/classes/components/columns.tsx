"use client"

import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import {
  createDataTableColumnHelper,
  createIndexColumn,
} from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"

import { initialAreaTypes } from "@/features/tenant/settings/types/lib/data"
import { fullName } from "@/features/tenant/staff/components/columns"
import { initialStaff } from "@/features/tenant/staff/lib/data"

import type { ClassSession } from "../lib/schema"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

export function instructorName(instructorId?: string) {
  const staff = initialStaff.find((s) => s.id === instructorId)
  return staff ? fullName(staff) : "Unassigned"
}

export function areaName(areaId?: string) {
  const area = initialAreaTypes.find((a) => a.id === areaId)
  return area?.name ?? "—"
}

function formatTime(time: string) {
  const [hourStr, minute] = time.split(":")
  const hour = Number(hourStr)
  const period = hour < 12 ? "AM" : "PM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${period}`
}

interface ClassColumnActions {
  onEdit: (cls: ClassSession) => void
  onDelete: (cls: ClassSession) => void
}

export function createClassColumns({ onEdit, onDelete }: ClassColumnActions) {
  const columnHelper = createDataTableColumnHelper<ClassSession>()

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${row.name} ${row.classType}`, {
      id: "class",
      header: "Class",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {row.original.name}
          </p>
          {row.original.classType && (
            <p className="truncate text-xs text-muted-foreground">
              {row.original.classType}
            </p>
          )}
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
    columnHelper.accessor((row) => `${row.startTime}-${row.endTime}`, {
      id: "time",
      header: "Time",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatTime(row.original.startTime)} – {formatTime(row.original.endTime)}
        </span>
      ),
    }),
    columnHelper.accessor("instructorId", {
      header: "Instructor",
      enableGlobalFilter: false,
      cell: ({ getValue }) => instructorName(getValue()),
    }),
    columnHelper.accessor("areaId", {
      header: "Area",
      enableGlobalFilter: false,
      cell: ({ getValue }) => areaName(getValue()),
    }),
    columnHelper.accessor("maxCapacity", {
      header: "Capacity",
      enableGlobalFilter: false,
      cell: ({ getValue }) => getValue() ?? "—",
    }),
    columnHelper.accessor("price", {
      header: "Price",
      enableGlobalFilter: false,
      cell: ({ getValue }) => currency.format(getValue()),
    }),
    columnHelper.accessor("visibility", {
      header: "Visibility",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-full font-normal">
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PenSquare />
              Edit Class
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 />
              Remove Class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
