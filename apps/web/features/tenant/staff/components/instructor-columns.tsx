"use client"

import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
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
import { cn } from "@repo/ui/lib/utils"

import type { StaffMember } from "../lib/schema"
import { fullName, initials, payCurrency } from "./columns"

interface InstructorColumnActions {
  onEdit: (staff: StaffMember) => void
  onDelete: (staff: StaffMember) => void
}

export function createInstructorColumns({
  onEdit,
  onDelete,
}: InstructorColumnActions) {
  const columnHelper = createDataTableColumnHelper<StaffMember>()

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${fullName(row)} ${row.email}`, {
      id: "instructor",
      header: "Instructor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarImage src={row.original.avatarUrl} alt="" />
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials(row.original)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {row.original.displayName || fullName(row.original)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("instructorType", {
      header: "Type",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-full font-normal">
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("sports", {
      header: "Sports",
      enableGlobalFilter: false,
      cell: ({ getValue }) => getValue() || (
        <span className="text-muted-foreground">—</span>
      ),
    }),
    columnHelper.accessor("payRate", {
      header: "Rate",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <span className="text-foreground">
          {payCurrency.format(row.original.payRate)}
          {row.original.payType === "Hourly"
            ? "/hr"
            : row.original.payType === "Per Class"
              ? "/class"
              : "/mo"}
        </span>
      ),
    }),
    columnHelper.accessor("canBeBooked", {
      header: "Bookable",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() ? "default" : "secondary"}
          className="rounded-full"
        >
          {getValue() ? "Yes" : "No"}
        </Badge>
      ),
    }),
    columnHelper.accessor("activeInstructor", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() ? "default" : "secondary"}
          className={cn("rounded-full", !getValue() && "bg-muted text-foreground")}
        >
          {getValue() ? "Active" : "Inactive"}
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
              Edit Instructor
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 />
              Remove Instructor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
