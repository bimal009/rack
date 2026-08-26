"use client"

import { useMemo, useState } from "react"
import { Download, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"
import { initialProducts } from "../lib/data"
import type { Product, ProductInput } from "../lib/schema"
import { createProductColumns } from "./columns"
import { ProductFormSheet } from "./product-form-sheet"

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

  function handleExport() {
    exportToCsv(
      "products.csv",
      visible.map((product) => ({
        Name: product.name,
        Category: product.category,
        Brand: product.brand ?? "",
        Price: product.price,
        Status: product.active ? "Active" : "Inactive",
      }))
    )
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
      <div className="flex items-center justify-between gap-2">
        <FilterPills options={filters} value={filter} onChange={setFilter} />
        <Button variant="outline" onClick={handleExport}>
          <Download className="size-4" />
          Export
        </Button>
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
