"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, Plus, Receipt, ShoppingCart, Trash2, UserRound } from "lucide-react"
import {
  orderFormSchema,
  orderStatuses,
  type Order,
  type OrderFormInput,
  type OrderFormItem,
  type OrderStatus,
} from "@repo/types"

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
import { useMembersQuery } from "@/features/tenant/members/hooks/use-members"
import { initialPackages } from "@/features/tenant/revenue/packages/lib/data"
import { useProductsQuery } from "@/features/tenant/revenue/products/hooks/use-products"

import { generateOrderId } from "../lib/data"
type SaleItemType = OrderFormItem["type"]

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
  tenant: string
  onSubmit: (order: Order) => void
  onCancel: () => void
}

function OrderFormBody({ tenant, onSubmit, onCancel }: OrderFormBodyProps) {
  const products = useProductsQuery(tenant, { limit: 100 })
  const members = useMembersQuery(tenant, { limit: 100 })
  const form = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { memberId: "", items: [], status: "Paid" },
  })
  const values = useWatch<OrderFormInput>({
    control: form.control,
    defaultValue: { memberId: "", items: [], status: "Paid" },
  })
  const { errors } = form.formState
  const memberId = values.memberId
  const items = values.items
  const status = values.status

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
    form.setValue("items", [
      ...form.getValues("items"),
      { type, refId: "", name: "", price: 0, quantity: 1 },
    ], { shouldDirty: true })
  }

  function updateItem(index: number, patch: Partial<OrderFormItem>) {
    form.setValue("items", form.getValues("items").map((item, i) =>
      i === index ? { ...item, ...patch } : item
    ), { shouldDirty: true })
  }

  function removeItem(index: number) {
    form.setValue("items", form.getValues("items").filter((_, i) => i !== index), { shouldDirty: true })
  }

  function submit(values: OrderFormInput) {
    const selectedMember = (members.data?.data ?? []).find((candidate) => candidate.id === values.memberId)
    if (!selectedMember) {
      form.setError("memberId", { message: "Select a member to continue." })
      return
    }
    const validItems = values.items.filter((item) => item.refId)
    const order: Order = {
      id: generateOrderId(),
      memberName: selectedMember.user.name,
      memberEmail: selectedMember.user.email,
      items: validItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
      })),
      total: validItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: values.status,
      date: formatOrderDate(new Date()),
    }

    onSubmit(order)
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex h-full flex-col">
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
              items={(members.data?.data ?? []).map((m) => m.id)}
              itemToStringLabel={(id) => {
                const found = members.data?.data.find((m) => m.id === id)
                return found ? `${found.user.name} — ${found.user.email}` : id
              }}
              value={memberId || null}
              onValueChange={(value) => form.setValue("memberId", value ?? "", { shouldDirty: true })}
            >
              <ComboboxInput
                id="order-member"
                placeholder="Search member..."
              />
              <ComboboxContent>
                <ComboboxEmpty>No members found.</ComboboxEmpty>
                <ComboboxList>
                  {(id: string) => {
                    const found = members.data?.data.find((m) => m.id === id)
                    return (
                      <ComboboxItem key={id} value={id}>
                        {found ? `${found.user.name} — ${found.user.email}` : id}
                      </ComboboxItem>
                    )
                  }}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldError>{errors.memberId?.message}</FieldError>
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

          <FieldError>{errors.items?.message}</FieldError>

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
              onValueChange={(value) => form.setValue("status", value as OrderStatus, { shouldDirty: true })}
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
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (order: Order) => void
}

export function OrderFormSheet({
  tenant,
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
            tenant={tenant}
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
