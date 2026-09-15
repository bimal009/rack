"use client"

import { useForm, useWatch, type DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, Check, ImageIcon, Info, ShoppingBag } from "lucide-react"
import {
  productInsertSchema,
  productVisibilityEnumSchema,
  type NewProduct,
  type Product,
  type ProductInsertInput,
} from "@repo/types"

import { MultiImageUpload } from "@/features/media"
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
import { Spinner } from "@repo/ui/components/ui/spinner"
import { Switch } from "@repo/ui/components/ui/switch"
import { Textarea } from "@repo/ui/components/ui/textarea"

import { FormSection, FormSheetHeader } from "@/features/tenant/components/form-section"
import { MultiSelectCombobox } from "@/features/tenant/components/multi-select-combobox"
import { useBrandsQuery } from "@/features/tenant/settings/types/hooks/use-brands"
import { useProductCategoriesQuery } from "@/features/tenant/settings/types/hooks/use-product-categories"
import { useProductFeaturesQuery } from "@/features/tenant/settings/types/hooks/use-product-features"
import { useTaxRatesQuery } from "@/features/tenant/settings/types/hooks/use-tax-rates"

function toFormValues(product?: Product | null): DefaultValues<ProductInsertInput> {
  if (!product) {
    return {
      name: "",
      categoryId: "",
      brandId: "",
      sku: "",
      visibility: "Public",
      isActive: true,
      price: undefined,
      costPrice: undefined,
      taxRateId: undefined,
      description: "",
      featureIds: [],
      images: [],
    }
  }
  return {
    name: product.name,
    categoryId: product.categoryId,
    brandId: product.brandId ?? undefined,
    sku: product.sku ?? "",
    visibility: product.visibility,
    isActive: product.isActive,
    price: product.price,
    costPrice: product.costPrice ?? undefined,
    taxRateId: product.taxRateId ?? undefined,
    description: product.description ?? "",
    featureIds: product.features.map((f) => f.featureId),
    images: product.images,
  }
}

interface ProductFormBodyProps {
  tenant: string
  product?: Product | null
  pending?: boolean
  onSubmit: (values: NewProduct) => void
  onCancel: () => void
}

function ProductFormBody({
  tenant,
  product,
  pending,
  onSubmit,
  onCancel,
}: ProductFormBodyProps) {
  const categories = useProductCategoriesQuery(tenant, { limit: 100 })
  const brands = useBrandsQuery(tenant, { limit: 100 })
  const taxRates = useTaxRatesQuery(tenant, { limit: 100 })
  const productFeatures = useProductFeaturesQuery(tenant, { limit: 100 })

  const form = useForm<ProductInsertInput, unknown, NewProduct>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: toFormValues(product),
  })
  const { errors } = form.formState
  const values = useWatch<ProductInsertInput>({
    control: form.control,
    defaultValue: toFormValues(product),
  })
  const isEdit = Boolean(product)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
      <SheetHeader>
        <FormSheetHeader
          icon={ShoppingBag}
          title={isEdit ? "Edit product" : "Add product"}
          description={
            isEdit
              ? "Update this product's details and pricing."
              : "Add a product to sell in your gym shop."
          }
        />
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <FormSection icon={Info} title="General">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
            <Input
              id="product-name"
              placeholder="Whey Protein 1kg"
              defaultValue={values.name ?? ""}
              aria-invalid={Boolean(errors.name)}
              {...form.register("name")}
            />
              <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.categoryId)}>
              <FieldLabel htmlFor="product-category">Category</FieldLabel>
              <Select
                value={values.categoryId ?? ""}
                onValueChange={(value) => form.setValue("categoryId", value ?? "", { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger
                  id="product-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.categoryId)}
                >
                  <SelectValue placeholder="Select category">
                    {() =>
                      categories.data?.data.find(
                        (category) => category.id === values.categoryId
                      )?.name ?? "Select category"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(categories.data?.data ?? []).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.categoryId?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="product-brand">Brand</FieldLabel>
              <Select
                value={values.brandId ?? ""}
                onValueChange={(value) => form.setValue("brandId", value || undefined, { shouldDirty: true })}
              >
                <SelectTrigger id="product-brand" className="w-full">
                  <SelectValue placeholder="Select brand">
                    {() =>
                      brands.data?.data.find((b) => b.id === values.brandId)
                        ?.name ?? "Select brand"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(brands.data?.data ?? []).map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="product-sku">SKU / Product code</FieldLabel>
            <Input
              id="product-sku"
              placeholder="e.g. WP-1KG"
              defaultValue={values.sku ?? ""}
              {...form.register("sku")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="product-visibility">Visibility</FieldLabel>
            <Select
                value={values.visibility ?? "Public"}
                onValueChange={(value) => form.setValue("visibility", value as NewProduct["visibility"], { shouldDirty: true })}
            >
              <SelectTrigger id="product-visibility" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productVisibilityEnumSchema.options.map((visibility) => (
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
              checked={values.isActive ?? false}
              onCheckedChange={(checked) => form.setValue("isActive", checked, { shouldDirty: true })}
            />
            <Label htmlFor="product-active">Active</Label>
          </div>
        </FormSection>

        <FormSection icon={Banknote} title="Pricing">
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
                  step="1"
                  placeholder="0"
                  value={values.price ?? ""}
                  aria-invalid={Boolean(errors.price)}
                  onChange={(event) => form.setValue("price", event.target.valueAsNumber, { shouldDirty: true })}
                />
              </InputGroup>
              <FieldError>{errors.price?.message}</FieldError>
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
                  step="1"
                  placeholder="0"
                  value={values.costPrice ?? ""}
                  aria-invalid={Boolean(errors.costPrice)}
                  onChange={(event) => form.setValue("costPrice", event.target.value === "" ? undefined : event.target.valueAsNumber, { shouldDirty: true })}
                />
              </InputGroup>
              <FieldDescription>
                What you pay per unit, used for margin reporting.
              </FieldDescription>
              <FieldError>{errors.costPrice?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="product-tax-rate">Tax rate</FieldLabel>
            <Select
              value={values.taxRateId ?? ""}
              onValueChange={(value) => form.setValue("taxRateId", value || undefined, { shouldDirty: true })}
            >
              <SelectTrigger id="product-tax-rate" className="w-full">
                <SelectValue placeholder="Select rate">
                  {() => {
                    const rate = taxRates.data?.data.find(
                      (r) => r.id === values.taxRateId
                    )
                    return rate ? `${rate.name} (${rate.rate}%)` : "Select rate"
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(taxRates.data?.data ?? []).map((rate) => (
                  <SelectItem key={rate.id} value={rate.id}>
                    {rate.name} ({rate.rate}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Applied to this product&apos;s price at point of sale.
            </FieldDescription>
          </Field>
        </FormSection>

        <FormSection icon={ImageIcon} title="Presentation">
          <Field data-invalid={Boolean(errors.description)}>
            <FieldLabel htmlFor="product-description">
              Description
            </FieldLabel>
            <Textarea
              id="product-description"
              placeholder="Describe this product"
              defaultValue={values.description ?? ""}
              aria-invalid={Boolean(errors.description)}
              {...form.register("description")}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          <MultiSelectCombobox
            label="Features"
            description="Tags shown to members browsing the shop."
            placeholder="Search tags..."
            emptyMessage="No tags found."
            options={productFeatures.data?.data ?? []}
            selected={values.featureIds ?? []}
            onChange={(featureIds) => form.setValue("featureIds", featureIds, { shouldDirty: true })}
          />

          <Field>
            <FieldLabel>Images</FieldLabel>
            <MultiImageUpload
              folder="products"
              value={values.images ?? []}
              onChange={(images) => form.setValue("images", images, { shouldDirty: true })}
            />
          </Field>
        </FormSection>
      </SheetBody>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Check className="size-4" />}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </SheetFooter>
    </form>
  )
}

interface ProductFormSheetProps {
  tenant: string
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  pending?: boolean
  onSubmit: (values: NewProduct) => void
}

export function ProductFormSheet({
  tenant,
  open,
  onOpenChange,
  product,
  pending,
  onSubmit,
}: ProductFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {open && (
          <ProductFormBody
            key={product?.id ?? "new"}
            tenant={tenant}
            product={product}
            pending={pending}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
