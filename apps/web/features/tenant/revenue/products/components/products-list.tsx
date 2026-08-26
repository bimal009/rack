"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog"
import type { Product, ProductInput } from "../lib/schema"
import { createProductColumns } from "./columns"
import { ProductFormSheet } from "./product-form-sheet"

const initialProducts: Product[] = [
  {
    id: "prod_1",
    name: "Whey Protein 1kg",
    category: "Supplements",
    brand: "Optimum Nutrition",
    barcode: "",
    sku: "WP-1KG",
    visibility: "Public",
    active: true,
    price: 3499,
    costPrice: 2400,
    revenueAccount: "Supplement Sales",
    taxRate: "13%",
    description: "",
    features: "Best Seller",
  },
  {
    id: "prod_2",
    name: "Creatine Monohydrate 500g",
    category: "Supplements",
    brand: "MyProtein",
    barcode: "",
    sku: "CM-500",
    visibility: "Public",
    active: true,
    price: 1999,
    costPrice: 1200,
    revenueAccount: "Supplement Sales",
    taxRate: "13%",
    description: "",
    features: "",
  },
  {
    id: "prod_3",
    name: "Gym Tank Top",
    category: "Apparel",
    brand: "Gymshark",
    barcode: "",
    sku: "GTT-BLK",
    visibility: "Public",
    active: true,
    price: 2200,
    costPrice: 900,
    revenueAccount: "Apparel Sales",
    taxRate: "13%",
    description: "",
    features: "New Arrival",
  },
  {
    id: "prod_4",
    name: "Lifting Straps",
    category: "Accessories",
    brand: "Generic",
    barcode: "",
    sku: "LS-01",
    visibility: "Public",
    active: true,
    price: 1450,
    costPrice: 600,
    revenueAccount: "Retail Revenue",
    taxRate: "13%",
    description: "",
    features: "",
  },
  {
    id: "prod_5",
    name: "Adjustable Dumbbell Set",
    category: "Equipment",
    brand: "Generic",
    barcode: "",
    sku: "ADS-20",
    visibility: "Public",
    active: true,
    price: 18900,
    costPrice: 14000,
    revenueAccount: "Retail Revenue",
    taxRate: "13%",
    description: "",
    features: "",
  },
  {
    id: "prod_6",
    name: "Shaker Bottle",
    category: "Accessories",
    brand: "Generic",
    barcode: "",
    sku: "SB-700",
    visibility: "Private",
    active: false,
    price: 999,
    costPrice: 400,
    revenueAccount: "Retail Revenue",
    taxRate: "13%",
    description: "",
    features: "",
  },
]

const filters = ["All", "Active", "Inactive"] as const

function generateId() {
  return `prod_${Math.random().toString(36).slice(2, 10)}`
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const visible =
    filter === "All"
      ? products
      : products.filter((p) => (filter === "Active" ? p.active : !p.active))

  function handleAdd() {
    setEditingProduct(null)
    setSheetOpen(true)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setSheetOpen(true)
  }

  function handleSubmit(values: ProductInput) {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...values }
            : product
        )
      )
      toast.success(`${values.name} updated`)
    } else {
      setProducts((prev) => [{ ...values, id: generateId() }, ...prev])
      toast.success(`${values.name} created`)
    }
  }

  function handleDelete() {
    if (!deletingProduct) return
    setProducts((prev) =>
      prev.filter((product) => product.id !== deletingProduct.id)
    )
    toast.success(`${deletingProduct.name} deleted`)
    setDeletingProduct(null)
  }

  const columns = useMemo(
    () =>
      createProductColumns({
        onEdit: handleEdit,
        onDelete: setDeletingProduct,
      }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={visible}
        getRowId={(row) => row.id}
        enableRowSelection
        searchPlaceholder="Search products..."
        emptyMessage="No products found."
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
            <Button onClick={handleAdd}>
              <Plus className="size-4" />
              Add Product
            </Button>
          </>
        }
      />

      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editingProduct}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Delete product?"
        description={
          deletingProduct
            ? `"${deletingProduct.name}" will be removed from the shop.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
