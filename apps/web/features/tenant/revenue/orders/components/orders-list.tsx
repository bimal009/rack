"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"

import { initialOrders } from "../lib/data"
import { orderStatuses, type Order, type OrderStatus } from "../lib/schema"
import { createOrderColumns } from "./columns"
import { OrderDetailSheet } from "./order-detail-sheet"

const filters = ["All", ...orderStatuses] as const

interface OrdersListProps {
  tenant: string
}

export function OrdersList({ tenant }: OrdersListProps) {
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
            <Button
              nativeButton={false}
              render={<Link href={`/s/${tenant}/revenue/orders/pos`} />}
            >
              <Plus className="size-4" />
              New Sale
            </Button>
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
