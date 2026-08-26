"use client"

import { useState, type FormEvent } from "react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { Field, FieldLabel } from "@repo/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import { Separator } from "@repo/ui/components/ui/separator"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"

import { orderStatusVariant } from "./columns"
import { orderStatuses, type Order, type OrderStatus } from "../lib/schema"

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

interface OrderDetailBodyProps {
  order: Order
  onStatusChange: (order: Order, status: OrderStatus) => void
  onClose: () => void
}

function OrderDetailBody({ order, onStatusChange, onClose }: OrderDetailBodyProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onStatusChange(order, status)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="font-mono">{order.id}</SheetTitle>
        <SheetDescription>Placed on {order.date}</SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials(order.memberName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {order.memberName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {order.memberEmail}
            </p>
          </div>
          <Badge
            variant={orderStatusVariant[order.status]}
            className="ml-auto rounded-full"
          >
            {order.status}
          </Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Items</p>
          <div className="flex flex-col gap-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground">
                  {item.qty}× {item.name}
                </span>
                <span className="text-muted-foreground">
                  {currency.format(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">
              {currency.format(order.total)}
            </span>
          </div>
        </div>

        <Separator />

        <Field>
          <FieldLabel htmlFor="order-status">Order status</FieldLabel>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as OrderStatus)}
          >
            <SelectTrigger id="order-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="submit" disabled={status === order.status}>
          Update status
        </Button>
      </SheetFooter>
    </form>
  )
}

interface OrderDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onStatusChange: (order: Order, status: OrderStatus) => void
}

export function OrderDetailSheet({
  open,
  onOpenChange,
  order,
  onStatusChange,
}: OrderDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {open && order && (
          <OrderDetailBody
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
