"use client"

import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react"

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

import type { Package, PackageStatus } from "../lib/schema"

export const packageStatusVariant: Record<
  PackageStatus,
  "default" | "secondary" | "outline"
> = {
  Active: "default",
  Draft: "secondary",
  Archived: "outline",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

interface PackageColumnActions {
  onEdit: (pkg: Package) => void
  onDelete: (pkg: Package) => void
}

export function createPackageColumns({
  onEdit,
  onDelete,
}: PackageColumnActions) {
  const columnHelper = createDataTableColumnHelper<Package>()

  return columnHelper.columns([
    createSelectionColumn(columnHelper),
    createIndexColumn(columnHelper),
    columnHelper.accessor("name", {
      header: "Package",
      cell: ({ row }) => (
        <p className="truncate text-sm font-medium text-foreground">
          {row.original.name}
        </p>
      ),
    }),
    columnHelper.accessor("sessions", {
      header: "Sessions",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()} credits</span>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Price",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {currency.format(row.original.price)}
        </span>
      ),
    }),
    columnHelper.accessor("validityDays", {
      header: "Validity",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()} days</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge
          variant={packageStatusVariant[getValue()]}
          className="rounded-full"
        >
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
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PenSquare />
              Edit package
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 />
              Delete package
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
