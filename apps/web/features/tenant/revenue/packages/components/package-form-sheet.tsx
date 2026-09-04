"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { useParams } from "next/navigation"
import { CalendarCheck, Info, Layers, ListChecks, Plus, Sliders, Trash2, X } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field"
import { Input } from "@repo/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group"
import { Label } from "@repo/ui/components/ui/label"
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
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"

import { useGymPlansQuery } from "../../plans/hooks/use-plans"
import { initialProducts } from "../../products/lib/data"
import { fieldErrors } from "../../lib/validation"
import {
  packageSchema,
  packageVisibilities,
  type Package,
  type PackageInput,
  type PackageItem,
  type PackageItemType,
  type PackageVisibility,
} from "../lib/schema"

interface PackageFormValues {
  name: string
  price: string
  visibility: PackageVisibility
  active: boolean
  description: string
  useSingleQuantity: boolean
  items: PackageItem[]
  bookable: boolean
}

function toFormValues(pkg?: Package | null): PackageFormValues {
  if (!pkg) {
    return {
      name: "",
      price: "",
      visibility: "Public",
      active: true,
      description: "",
      useSingleQuantity: false,
      items: [],
      bookable: false,
    }
  }
  return {
    name: pkg.name,
    price: String(pkg.price),
    visibility: pkg.visibility,
    active: pkg.active,
    description: pkg.description ?? "",
    useSingleQuantity: pkg.useSingleQuantity,
    items: pkg.items,
    bookable: pkg.bookable,
  }
}

interface ImagePreview {
  id: string
  url: string
}

interface PackageFormBodyProps {
  pkg?: Package | null
  onSubmit: (values: PackageInput) => void
  onCancel: () => void
}

function PackageFormBody({ pkg, onSubmit, onCancel }: PackageFormBodyProps) {
  const tenant = useParams<{ tenant: string }>().tenant
  const gymPlans = useGymPlansQuery(tenant, { limit: 100 })
  const [values, setValues] = useState<PackageFormValues>(() =>
    toFormValues(pkg)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [image, setImage] = useState<ImagePreview | null>(null)
  const createdUrls = useRef<string[]>([])
  const isEdit = Boolean(pkg)

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      createdUrls.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    createdUrls.current.push(url)
    setImage({ id: file.name, url })
    event.target.value = ""
  }

  function pickableOptions(type: PackageItemType) {
    return type === "plan"
      ? (gymPlans.data?.data ?? []).map((p) => ({ refId: p.id, name: p.name }))
      : initialProducts.map((p) => ({ refId: p.id, name: p.name }))
  }

  function addItem(type: PackageItemType) {
    setValues((v) => ({
      ...v,
      items: [...v.items, { type, refId: "", name: "", quantity: 1 }],
    }))
  }

  function updateItem(index: number, patch: Partial<PackageItem>) {
    setValues((v) => ({
      ...v,
      items: v.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }))
  }

  function removeItem(index: number) {
    setValues((v) => ({
      ...v,
      items: v.items.filter((_, i) => i !== index),
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = packageSchema.safeParse({
      ...values,
      items: values.items.map((item) => ({
        ...item,
        quantity: values.useSingleQuantity ? 1 : item.quantity,
      })),
    })

    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={Layers}
          title={isEdit ? "Edit package" : "Add package"}
          description={
            isEdit
              ? "Update this package's price and included items."
              : "Bundle plans and products together at one fixed price."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="Basic details">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="package-name">Name</FieldLabel>
              <Input
                id="package-name"
                placeholder="10 Session Pack"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.price)}>
              <FieldLabel htmlFor="package-price">Package price</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>NPR</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="package-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={values.price}
                  aria-invalid={Boolean(errors.price)}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, price: e.target.value }))
                  }
                />
              </InputGroup>
              <FieldDescription>
                The single fixed price charged for the whole package.
              </FieldDescription>
              <FieldError>{errors.price}</FieldError>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="package-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    visibility: value as PackageVisibility,
                  }))
                }
              >
                <SelectTrigger id="package-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {packageVisibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-center gap-2.5 self-end pb-2">
              <Switch
                id="package-active"
                checked={values.active}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, active: checked }))
                }
              />
              <Label htmlFor="package-active">Active</Label>
            </div>
          </div>

          <Field data-invalid={Boolean(errors.description)}>
            <FieldLabel htmlFor="package-description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              id="package-description"
              placeholder="Describe what's included"
              value={values.description}
              aria-invalid={Boolean(errors.description)}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
            <FieldError>{errors.description}</FieldError>
          </Field>

          <Field>
            <FieldLabel>
              Image <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            {image ? (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt=""
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-foreground/70 text-background"
                >
                  <X className="size-2.5" />
                  <span className="sr-only">Remove image</span>
                </button>
              </div>
            ) : (
              <label className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground transition-colors hover:bg-muted/50">
                <Plus className="size-4" />
                <span className="sr-only">Add image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelected}
                />
              </label>
            )}
          </Field>
        </FormSection>

        <FormSection
          icon={Sliders}
          title="Package options"
          description="The buyer picks one quantity that applies to every item."
        >
          <div className="flex items-center gap-2.5">
            <Switch
              id="package-single-quantity"
              checked={values.useSingleQuantity}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, useSingleQuantity: checked }))
              }
            />
            <Label htmlFor="package-single-quantity">
              Use a single quantity for the whole package
            </Label>
          </div>
        </FormSection>

        <FormSection
          icon={ListChecks}
          title="Items in this package"
          description="Add the plans and products included. Each can have its own quantity."
        >
          {values.items.length > 0 && (
            <div className="flex flex-col gap-2">
              {values.items.map((item, index) => (
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
                      })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={item.type === "plan" ? "Plan" : "Product"}
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

                  {!values.useSingleQuantity && (
                    <Field className="w-20 shrink-0">
                      <FieldLabel
                        htmlFor={`package-item-qty-${index}`}
                        className="text-xs font-normal text-muted-foreground"
                      >
                        Qty
                      </FieldLabel>
                      <Input
                        id={`package-item-qty-${index}`}
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
                  )}

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

          <FieldError>{errors.items}</FieldError>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addItem("plan")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-3.5" />
              Add Plan
            </button>
            <button
              type="button"
              onClick={() => addItem("product")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-3.5" />
              Add Product
            </button>
          </div>
        </FormSection>

        <FormSection
          icon={CalendarCheck}
          title="Booking"
          description="Buyers pick one of the slots below."
        >
          <div className="flex items-center gap-2.5">
            <Switch
              id="package-bookable"
              checked={values.bookable}
              onCheckedChange={(checked) =>
                setValues((v) => ({ ...v, bookable: checked }))
              }
            />
            <Label htmlFor="package-bookable">Bookable</Label>
          </div>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add"}</Button>
      </SheetFooter>
    </form>
  )
}

interface PackageFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pkg?: Package | null
  onSubmit: (values: PackageInput) => void
}

export function PackageFormSheet({
  open,
  onOpenChange,
  pkg,
  onSubmit,
}: PackageFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <PackageFormBody
            key={pkg?.id ?? "new"}
            pkg={pkg}
            onSubmit={(values) => {
              onSubmit(values)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
