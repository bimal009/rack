"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { Plus, X } from "lucide-react"

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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { fieldErrors } from "../../lib/validation"
import {
  productBrands,
  productCategories,
  productFeatureOptions,
  productRevenueAccounts,
  productSchema,
  productTaxRates,
  productVisibilities,
  type Product,
  type ProductBrand,
  type ProductCategory,
  type ProductInput,
  type ProductVisibility,
} from "../lib/schema"

interface ProductFormValues {
  name: string
  category: ProductCategory | ""
  brand: ProductBrand | ""
  barcode: string
  sku: string
  visibility: ProductVisibility
  active: boolean

  price: string
  costPrice: string
  revenueAccount: string
  taxRate: string

  description: string
  features: string
}

function toFormValues(product?: Product | null): ProductFormValues {
  if (!product) {
    return {
      name: "",
      category: "",
      brand: "",
      barcode: "",
      sku: "",
      visibility: "Public",
      active: true,
      price: "",
      costPrice: "",
      revenueAccount: "",
      taxRate: "",
      description: "",
      features: "",
    }
  }
  return {
    name: product.name,
    category: product.category,
    brand: product.brand ?? "",
    barcode: product.barcode ?? "",
    sku: product.sku ?? "",
    visibility: product.visibility,
    active: product.active,
    price: String(product.price),
    costPrice: product.costPrice != null ? String(product.costPrice) : "",
    revenueAccount: product.revenueAccount ?? "",
    taxRate: product.taxRate ?? "",
    description: product.description ?? "",
    features: product.features ?? "",
  }
}

interface ImagePreview {
  id: string
  url: string
}

interface ProductFormBodyProps {
  product?: Product | null
  onSubmit: (values: ProductInput) => void
  onCancel: () => void
}

function ProductFormBody({ product, onSubmit, onCancel }: ProductFormBodyProps) {
  const [values, setValues] = useState<ProductFormValues>(() =>
    toFormValues(product)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [images, setImages] = useState<ImagePreview[]>([])
  const createdUrls = useRef<string[]>([])
  const isEdit = Boolean(product)

  useEffect(() => {
    // Intentionally reads the ref at cleanup time to revoke every object URL
    // created over the component's lifetime, not just what existed on mount.
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      createdUrls.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files?.length) return

    const next = Array.from(files).map((file) => ({
      id: `${file.name}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(file),
    }))
    createdUrls.current.push(...next.map((n) => n.url))
    setImages((prev) => [...prev, ...next])
    event.target.value = ""
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const result = productSchema.safeParse({
      ...values,
      category: values.category || undefined,
      brand: values.brand || undefined,
      costPrice: values.costPrice === "" ? undefined : values.costPrice,
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
        <SheetTitle>{isEdit ? "Edit product" : "Add Product"}</SheetTitle>
        <SheetDescription>
          {isEdit
            ? "Update this product's details and pricing."
            : "Add a product to sell in your gym shop."}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-6">
        <FieldSet>
          <FieldLegend>General</FieldLegend>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                placeholder="Whey Protein 1kg"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.category)}>
                <FieldLabel htmlFor="product-category">Categories</FieldLabel>
                <Select
                  value={values.category}
                  onValueChange={(value) =>
                    setValues((v) => ({
                      ...v,
                      category: value as ProductCategory,
                    }))
                  }
                >
                  <SelectTrigger
                    id="product-category"
                    className="w-full"
                    aria-invalid={Boolean(errors.category)}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.category}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="product-brand">Brand</FieldLabel>
                <Select
                  value={values.brand}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, brand: value as ProductBrand }))
                  }
                >
                  <SelectTrigger id="product-brand" className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {productBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="product-barcode">Barcode</FieldLabel>
                <Input
                  id="product-barcode"
                  placeholder="Scan or enter a code"
                  value={values.barcode}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, barcode: e.target.value }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="product-sku">
                  SKU / Product code
                </FieldLabel>
                <Input
                  id="product-sku"
                  placeholder="e.g. WP-1KG"
                  value={values.sku}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, sku: e.target.value }))
                  }
                />
              </Field>
            </div>
            <FieldDescription className="-mt-3">
              Scan the item here to fill this in. The till adds this product
              when the code is scanned.
            </FieldDescription>

            <Field>
              <FieldLabel htmlFor="product-visibility">Visibility</FieldLabel>
              <Select
                value={values.visibility}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    visibility: value as ProductVisibility,
                  }))
                }
              >
                <SelectTrigger id="product-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productVisibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-center gap-2.5">
              <Switch
                id="product-active"
                checked={values.active}
                onCheckedChange={(checked) =>
                  setValues((v) => ({ ...v, active: checked }))
                }
              />
              <Label htmlFor="product-active">Active</Label>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Pricing</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errors.price)}>
                <FieldLabel htmlFor="product-price">Price</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="product-price"
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
                <FieldError>{errors.price}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.costPrice)}>
                <FieldLabel htmlFor="product-cost-price">
                  Cost price
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>NPR</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="product-cost-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={values.costPrice}
                    aria-invalid={Boolean(errors.costPrice)}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        costPrice: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
                <FieldDescription>
                  What you pay per unit — used for margin reporting.
                </FieldDescription>
                <FieldError>{errors.costPrice}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="product-revenue-account">
                  Revenue Account
                </FieldLabel>
                <Select
                  value={values.revenueAccount}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, revenueAccount: value ?? "" }))
                  }
                >
                  <SelectTrigger
                    id="product-revenue-account"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {productRevenueAccounts.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="product-tax-rate">Tax rate</FieldLabel>
                <Select
                  value={values.taxRate}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, taxRate: value ?? "" }))
                  }
                >
                  <SelectTrigger id="product-tax-rate" className="w-full">
                    <SelectValue placeholder="Select rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTaxRates.map((rate) => (
                      <SelectItem key={rate} value={rate}>
                        {rate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Overrides the revenue account default at point of sale.
                </FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Presentation</FieldLegend>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="product-description">
                Description
              </FieldLabel>
              <Textarea
                id="product-description"
                placeholder="Describe this product"
                value={values.description}
                aria-invalid={Boolean(errors.description)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, description: e.target.value }))
                }
              />
              <FieldError>{errors.description}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="product-features">Features</FieldLabel>
              <Combobox
                items={productFeatureOptions}
                value={values.features || null}
                onValueChange={(value) =>
                  setValues((v) => ({ ...v, features: value ?? "" }))
                }
              >
                <ComboboxInput
                  id="product-features"
                  placeholder="Search features..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No features found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>

            <Field>
              <FieldLabel>Images</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative size-16 shrink-0 overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt=""
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="size-2.5" />
                      <span className="sr-only">Remove image</span>
                    </button>
                  </div>
                ))}
                <label className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground transition-colors hover:bg-muted/50">
                  <Plus className="size-4" />
                  <span className="sr-only">Add image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFilesSelected}
                  />
                </label>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface ProductFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (values: ProductInput) => void
}

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
  onSubmit,
}: ProductFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <ProductFormBody
            key={product?.id ?? "new"}
            product={product}
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
