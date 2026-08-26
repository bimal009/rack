"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { Member } from "@/features/tenant/members/components/columns"
import { addOrder, generateOrderId } from "../../lib/data"
import type { Order, OrderStatus } from "../../lib/schema"
import { PosCart, type CartLine } from "./pos-cart"
import { PosCatalog, type CatalogItem } from "./pos-catalog"

function formatOrderDate(date: Date) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

interface PosViewProps {
  tenant: string
}

export function PosView({ tenant }: PosViewProps) {
  const router = useRouter()
  const [cart, setCart] = useState<CartLine[]>([])
  const [member, setMember] = useState<Member | null>(null)
  const [status, setStatus] = useState<OrderStatus>("Paid")

  function handleAdd(item: CatalogItem) {
    const key = `${item.type}-${item.id}`
    setCart((prev) => {
      const existing = prev.find((line) => line.key === key)
      if (existing) {
        return prev.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + 1 } : line
        )
      }
      return [...prev, { ...item, key, quantity: 1 }]
    })
  }

  function handleIncrement(key: string) {
    setCart((prev) =>
      prev.map((line) =>
        line.key === key ? { ...line, quantity: line.quantity + 1 } : line
      )
    )
  }

  function handleDecrement(key: string) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.key === key ? { ...line, quantity: line.quantity - 1 } : line
        )
        .filter((line) => line.quantity > 0)
    )
  }

  function handleRemove(key: string) {
    setCart((prev) => prev.filter((line) => line.key !== key))
  }

  function handleCompleteSale() {
    if (!member || cart.length === 0) return

    const order: Order = {
      id: generateOrderId(),
      memberName: member.name,
      memberEmail: member.email,
      items: cart.map((line) => ({
        name: line.name,
        qty: line.quantity,
        price: line.price,
      })),
      total: cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
      status,
      date: formatOrderDate(new Date()),
    }

    addOrder(order)
    toast.success(`${order.id} created for ${member.name}`)
    router.push(`/s/${tenant}/revenue/orders`)
  }

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <PosCatalog onAdd={handleAdd} />
      <PosCart
        cart={cart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        member={member}
        onMemberChange={setMember}
        status={status}
        onStatusChange={setStatus}
        onCompleteSale={handleCompleteSale}
      />
    </div>
  )
}
