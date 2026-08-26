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

import type { Package } from "../lib/schema"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
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
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {row.original.name}
          </p>
          {row.original.description ? (
            <p className="truncate text-xs text-muted-foreground">
              {row.original.description}
            </p>
          ) : null}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.items.length, {
      id: "items",
      header: "Items",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.items.length}{" "}
          {row.original.items.length === 1 ? "item" : "items"}
        </span>
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
    columnHelper.accessor("active", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() ? "default" : "secondary"}
          className="rounded-full"
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
