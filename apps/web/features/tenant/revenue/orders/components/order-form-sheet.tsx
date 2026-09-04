"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Banknote, Plus, Receipt, ShoppingCart, Trash2, UserRound } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@repo/ui/components/ui/sheet"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { fullName } from "@/features/tenant/members/components/columns"
import { initialMembers } from "@/features/tenant/members/lib/data"
import { initialPackages } from "@/features/tenant/revenue/packages/lib/data"
import { useProductsQuery } from "@/features/tenant/revenue/products/hooks/use-products"

import { generateOrderId } from "../lib/data"
import { orderStatuses, type Order, type OrderStatus } from "../lib/schema"

type SaleItemType = "product" | "package"

interface SaleItem {
  type: SaleItemType
  refId: string
  name: string
  price: number
  quantity: number
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function formatOrderDate(date: Date) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

interface OrderFormBodyProps {
  onSubmit: (order: Order) => void
  onCancel: () => void
}

function OrderFormBody({ onSubmit, onCancel }: OrderFormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const products = useProductsQuery(tenant, { limit: 100 })
  const [memberEmail, setMemberEmail] = useState<string | null>(null)
  const [items, setItems] = useState<SaleItem[]>([])
  const [status, setStatus] = useState<OrderStatus>("Paid")
  const [error, setError] = useState("")

  const member = initialMembers.find((m) => m.email === memberEmail) ?? null
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function pickableOptions(type: SaleItemType) {
    return type === "product"
      ? (products.data?.data ?? [])
          .filter((p) => p.isActive)
          .map((p) => ({ refId: p.id, name: p.name, price: p.price }))
      : initialPackages
          .filter((p) => p.active)
          .map((p) => ({ refId: p.id, name: p.name, price: p.price }))
  }

  function addItem(type: SaleItemType) {
    setItems((prev) => [
      ...prev,
      { type, refId: "", name: "", price: 0, quantity: 1 },
    ])
  }

  function updateItem(index: number, patch: Partial<SaleItem>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    )
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!member) {
      setError("Select a member to continue.")
      return
    }
    const validItems = items.filter((item) => item.refId)
    if (validItems.length === 0) {
      setError("Add at least one product or package.")
      return
    }

    setError("")

    const order: Order = {
      id: generateOrderId(),
      memberName: fullName(member),
      memberEmail: member.email,
      items: validItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
      })),
      total: validItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status,
      date: formatOrderDate(new Date()),
    }

    onSubmit(order)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={Receipt}
          title="New sale"
          description="Sell products and packages to a member."
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={UserRound} title="Member">
          <Field>
            <FieldLabel htmlFor="order-member">Member</FieldLabel>
            <Combobox
              items={initialMembers.map((m) => m.email)}
              itemToStringLabel={(email) => {
                const found = initialMembers.find((m) => m.email === email)
                return found ? `${fullName(found)} — ${found.email}` : email
              }}
              value={memberEmail}
              onValueChange={setMemberEmail}
            >
              <ComboboxInput
                id="order-member"
                placeholder="Search member..."
              />
              <ComboboxContent>
                <ComboboxEmpty>No members found.</ComboboxEmpty>
                <ComboboxList>
                  {(email: string) => {
                    const found = initialMembers.find(
                      (m) => m.email === email
                    )
                    return (
                      <ComboboxItem key={email} value={email}>
                        {found ? `${fullName(found)} — ${found.email}` : email}
                      </ComboboxItem>
                    )
                  }}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </FormSection>

        <FormSection icon={ShoppingCart} title="Items">
          {items.length > 0 && (
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-end gap-2">
                  <Select
                    value={item.refId}
                    onValueChange={(refId) => {
                      const option = pickableOptions(item.type).find(
                        (o) => o.refId === refId
                      )
                      updateItem(index, {
                        refId: refId ?? "",
                        name: option?.name ?? "",
                        price: option?.price ?? 0,
                      })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          item.type === "product" ? "Product" : "Package"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {pickableOptions(item.type).map((option) => (
                        <SelectItem key={option.refId} value={option.refId}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Field className="w-20 shrink-0">
                    <FieldLabel
                      htmlFor={`order-item-qty-${index}`}
                      className="text-xs font-normal text-muted-foreground"
                    >
                      Qty
                    </FieldLabel>
                    <Input
                      id={`order-item-qty-${index}`}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, {
                          quantity: Number(e.target.value) || 1,
                        })
                      }
                    />
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <FieldError>{error}</FieldError>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addItem("product")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-3.5" />
              Add Product
            </button>
            <button
              type="button"
              onClick={() => addItem("package")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-3.5" />
              Add Package
            </button>
          </div>
        </FormSection>

        <FormSection icon={Banknote} title="Payment">
          <Field>
            <FieldLabel htmlFor="order-status">Payment status</FieldLabel>
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

          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 text-sm font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{currency.format(total)}</span>
          </div>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Complete Sale</Button>
      </SheetFooter>
    </form>
  )
}

interface OrderFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (order: Order) => void
}

export function OrderFormSheet({
  open,
  onOpenChange,
  onCreate,
}: OrderFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <OrderFormBody
            key="new-sale"
            onSubmit={(order) => {
              onCreate(order)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
