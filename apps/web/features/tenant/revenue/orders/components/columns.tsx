"use client"

import { Eye } from "lucide-react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  createDataTableColumnHelper,
  createIndexColumn,
  createSelectionColumn,
} from "@repo/ui/components/ui/data-table"

import type { Order, OrderStatus } from "../lib/schema"

export const orderStatusVariant: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Paid: "default",
  Pending: "secondary",
  Refunded: "outline",
  Cancelled: "destructive",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

interface OrderColumnActions {
  onView: (order: Order) => void
}

export function createOrderColumns({ onView }: OrderColumnActions) {
  const columnHelper = createDataTableColumnHelper<Order>()

  return columnHelper.columns([
    createSelectionColumn(columnHelper),
    createIndexColumn(columnHelper),
    columnHelper.accessor("id", {
      header: "Order",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium text-foreground">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor((row) => `${row.memberName} ${row.memberEmail}`, {
      id: "member",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials(row.original.memberName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {row.original.memberName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.memberEmail}
            </p>
          </div>
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
    columnHelper.accessor("total", {
      header: "Total",
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
        <Badge variant={orderStatusVariant[getValue()]} className="rounded-full">
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onView(row.original)}
        >
          <Eye className="size-4" />
          <span className="sr-only">View order</span>
        </Button>
      ),
    }),
  ])
}
