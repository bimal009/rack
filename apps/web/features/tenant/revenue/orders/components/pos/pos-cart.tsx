"use client"

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/ui/empty"
import { Field, FieldLabel } from "@repo/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import { Separator } from "@repo/ui/components/ui/separator"

import { initialMembers } from "@/features/tenant/members/lib/data"
import type { Member } from "@/features/tenant/members/components/columns"
import { orderStatuses, type OrderStatus } from "../../lib/schema"
import type { CatalogItem } from "./pos-catalog"

export interface CartLine extends CatalogItem {
  key: string
  quantity: number
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

interface PosCartProps {
  cart: CartLine[]
  onIncrement: (key: string) => void
  onDecrement: (key: string) => void
  onRemove: (key: string) => void
  member: Member | null
  onMemberChange: (member: Member | null) => void
  status: OrderStatus
  onStatusChange: (status: OrderStatus) => void
  onCompleteSale: () => void
}

export function PosCart({
  cart,
  onIncrement,
  onDecrement,
  onRemove,
  member,
  onMemberChange,
  status,
  onStatusChange,
  onCompleteSale,
}: PosCartProps) {
  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const canComplete = Boolean(member) && cart.length > 0

  return (
    <div className="flex h-full w-full max-w-sm shrink-0 flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <Field>
        <FieldLabel htmlFor="pos-member">Member</FieldLabel>
        <Combobox
          items={initialMembers.map((m) => m.email)}
          itemToStringLabel={(email) => {
            const found = initialMembers.find((m) => m.email === email)
            return found ? `${found.name} — ${found.email}` : email
          }}
          value={member?.email ?? null}
          onValueChange={(email) => {
            const found = initialMembers.find((m) => m.email === email) ?? null
            onMemberChange(found)
          }}
        >
          <ComboboxInput id="pos-member" placeholder="Search member..." />
          <ComboboxContent>
            <ComboboxEmpty>No members found.</ComboboxEmpty>
            <ComboboxList>
              {(email: string) => {
                const found = initialMembers.find((m) => m.email === email)
                return (
                  <ComboboxItem key={email} value={email}>
                    {found ? `${found.name} — ${found.email}` : email}
                  </ComboboxItem>
                )
              }}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      {member && (
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 p-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {member.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>
      )}

      <Separator />

      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <ShoppingCart />
            </EmptyMedia>
            <EmptyTitle>Cart is empty</EmptyTitle>
            <EmptyDescription>
              Add products or packages from the catalog.
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((line) => (
              <div key={line.key} className="flex items-start gap-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {line.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currency.format(line.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    onClick={() => onDecrement(line.key)}
                  >
                    <Minus className="size-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-5 text-center text-sm tabular-nums">
                    {line.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    onClick={() => onIncrement(line.key)}
                  >
                    <Plus className="size-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onRemove(line.key)}
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <Field>
        <FieldLabel htmlFor="pos-status">Payment status</FieldLabel>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as OrderStatus)}
        >
          <SelectTrigger id="pos-status" className="w-full">
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

      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-foreground">Total</span>
        <span className="text-foreground">{currency.format(total)}</span>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={!canComplete}
        onClick={onCompleteSale}
      >
        Complete Sale
      </Button>
    </div>
  )
}
