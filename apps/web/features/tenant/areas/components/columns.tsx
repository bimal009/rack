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

import type { Area } from "../lib/schema"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

interface AreaColumnActions {
  onEdit: (area: Area) => void
  onDelete: (area: Area) => void
  areaTypeName: (id: string) => string
}

export function createAreaColumns({
  onEdit,
  onDelete,
  areaTypeName,
}: AreaColumnActions) {
  const columnHelper = createDataTableColumnHelper<Area>()

  return columnHelper.columns([
    createSelectionColumn(columnHelper),
    createIndexColumn(columnHelper),
    columnHelper.accessor("name", {
      header: "Area",
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
    columnHelper.accessor("areaTypeId", {
      header: "Type",
      enableGlobalFilter: false,
      cell: ({ getValue }) => {
        const name = getValue() ? areaTypeName(getValue() as string) : ""
        return name ? (
          <Badge variant="outline" className="rounded-full font-normal">
            {name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    }),
    columnHelper.accessor("pricePerHour", {
      header: "Price / hour",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="font-medium text-foreground">
          {currency.format(getValue())}
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
        <DropdownMenu>
          <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PenSquare />
              Edit area
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 />
              Delete area
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
