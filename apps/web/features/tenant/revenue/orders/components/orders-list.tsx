"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import { initialOrders } from "../lib/data"
import { orderStatuses, type Order, type OrderStatus } from "../lib/schema"
import { createOrderColumns } from "./columns"
import { OrderDetailSheet } from "./order-detail-sheet"

const filters = ["All", ...orderStatuses] as const

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const visible =
    filter === "All" ? orders : orders.filter((o) => o.status === filter)

  function handleView(order: Order) {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  function handleStatusChange(order: Order, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status } : o))
    )
    toast.success(`${order.id} marked as ${status}`)
  }

  const columns = useMemo(
    () => createOrderColumns({ onView: handleView }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={visible}
        getRowId={(row) => row.id}
        enableRowSelection
        searchPlaceholder="Search orders by member..."
        emptyMessage="No orders found."
        toolbar={
          <>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="size-4" />
            </Button>
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setView("list")}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>
          </>
        }
      />

      <OrderDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
