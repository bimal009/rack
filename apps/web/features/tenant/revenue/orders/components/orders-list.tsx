"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"

import { initialOrders } from "../lib/data"
import { orderStatuses, type Order, type OrderStatus } from "../lib/schema"
import { createOrderColumns } from "./columns"
import { OrderDetailSheet } from "./order-detail-sheet"
import { OrderFormSheet } from "./order-form-sheet"

const filters = ["All", ...orderStatuses] as const

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newSaleOpen, setNewSaleOpen] = useState(false)

  const visible =
    filter === "All" ? orders : orders.filter((o) => o.status === filter)

  function handleView(order: Order) {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  function handleStatusChange(order: Order, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status } : o))
    )
    toast.success(`${order.id} marked as ${status}`)
  }

  function handleCreateOrder(order: Order) {
    setOrders((prev) => [order, ...prev])
    toast.success(`${order.id} created for ${order.memberName}`)
  }

  const columns = useMemo(
    () => createOrderColumns({ onView: handleView }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <FilterPills options={filters} value={filter} onChange={setFilter} />

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
            <Button onClick={() => setNewSaleOpen(true)}>
              <Plus className="size-4" />
              New Sale
            </Button>
          </>
        }
      />

      <OrderDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      <OrderFormSheet
        open={newSaleOpen}
        onOpenChange={setNewSaleOpen}
        onCreate={handleCreateOrder}
      />
    </div>
  )
}
