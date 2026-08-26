"use client"

import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
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

import type { StaffMember, StaffStatus } from "../lib/schema"

export const staffStatusVariant: Record<
  StaffStatus,
  "default" | "secondary"
> = {
  Active: "default",
  Inactive: "secondary",
}

export const payCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

export function fullName(staff: Pick<StaffMember, "firstName" | "lastName">) {
  return `${staff.firstName} ${staff.lastName}`.trim()
}

export function initials(staff: Pick<StaffMember, "firstName" | "lastName">) {
  return ((staff.firstName[0] ?? "") + (staff.lastName[0] ?? "")).toUpperCase()
}

function formatPayRate(staff: StaffMember) {
  const rate = payCurrency.format(staff.payRate)
  const suffix =
    staff.payType === "Hourly"
      ? "/hr"
      : staff.payType === "Per Class"
        ? "/class"
        : "/mo"
  return `${rate}${suffix}`
}

interface StaffColumnActions {
  onEdit: (staff: StaffMember) => void
  onDelete: (staff: StaffMember) => void
}

export function createStaffColumns({ onEdit, onDelete }: StaffColumnActions) {
  const columnHelper = createDataTableColumnHelper<StaffMember>()

  return columnHelper.columns([
    createSelectionColumn(columnHelper),
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${fullName(row)} ${row.email}`, {
      id: "staff",
      header: "Staff",
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
              {fullName(row.original)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <div>
          <Badge variant="outline" className="rounded-full font-normal">
            {row.original.role}
          </Badge>
          {row.original.specialty && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {row.original.specialty}
            </p>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("payRate", {
      header: "Pay Rate",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <span className="text-foreground">{formatPayRate(row.original)}</span>
      ),
    }),
    columnHelper.accessor("joined", {
      header: "Joined",
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
            variant={staffStatusVariant[status]}
            className={cn(
              "rounded-full",
              status === "Inactive" && "bg-muted text-foreground"
            )}
          >
            {status}
          </Badge>
        )
      },
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
              Edit Staff
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 />
              Remove Staff
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
