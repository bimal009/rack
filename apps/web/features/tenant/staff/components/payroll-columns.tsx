"use client"

import { PenSquare } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  createDataTableColumnHelper,
  createIndexColumn,
} from "@repo/ui/components/ui/data-table"

import type { StaffMember } from "../lib/schema"
import { fullName, initials, payCurrency } from "./columns"

function payRateLabel(staff: StaffMember) {
  const rate = payCurrency.format(staff.payRate)
  const suffix =
    staff.payType === "Hourly"
      ? "/hr"
      : staff.payType === "Per Class"
        ? "/class"
        : "/mo"
  return `${rate}${suffix}`
}

interface PayrollColumnActions {
  onEdit: (staff: StaffMember) => void
}

export function createPayrollColumns({ onEdit }: PayrollColumnActions) {
  const columnHelper = createDataTableColumnHelper<StaffMember>()

  return columnHelper.columns([
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
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-full font-normal">
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("payType", {
      header: "Pay Type",
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("payRate", {
      header: "Pay Rate",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {payRateLabel(row.original)}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() === "Active" ? "default" : "secondary"}
          className="rounded-full"
        >
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(row.original)}
        >
          <PenSquare className="size-3.5" />
          Edit Pay
        </Button>
      ),
    }),
  ])
}
