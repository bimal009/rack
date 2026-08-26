"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"

import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog"
import { initialPackages } from "../lib/data"
import type { Package, PackageInput } from "../lib/schema"
import { createPackageColumns } from "./columns"
import { PackageFormSheet } from "./package-form-sheet"

const filters = ["All", "Active", "Inactive"] as const

function generateId() {
  return `pkg_${Math.random().toString(36).slice(2, 10)}`
}

export function PackagesList() {
  const [packages, setPackages] = useState<Package[]>(initialPackages)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null)

  const visible =
    filter === "All"
      ? packages
      : packages.filter((p) => (filter === "Active" ? p.active : !p.active))

  function handleAdd() {
    setEditingPackage(null)
    setSheetOpen(true)
  }

  function handleEdit(pkg: Package) {
    setEditingPackage(pkg)
    setSheetOpen(true)
  }

  function handleSubmit(values: PackageInput) {
    if (editingPackage) {
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === editingPackage.id ? { ...pkg, ...values } : pkg
        )
      )
      toast.success(`${values.name} updated`)
    } else {
      setPackages((prev) => [{ ...values, id: generateId() }, ...prev])
      toast.success(`${values.name} created`)
    }
  }

  function handleDelete() {
    if (!deletingPackage) return
    setPackages((prev) => prev.filter((pkg) => pkg.id !== deletingPackage.id))
    toast.success(`${deletingPackage.name} deleted`)
    setDeletingPackage(null)
  }

  const columns = useMemo(
    () =>
      createPackageColumns({
        onEdit: handleEdit,
        onDelete: setDeletingPackage,
      }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <FilterPills options={filters} value={filter} onChange={setFilter} />

      <DataTable
        columns={columns}
        data={visible}
        getRowId={(row) => row.id}
        enableRowSelection
        searchPlaceholder="Search packages..."
        emptyMessage="No packages found."
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
              Add Package
            </Button>
          </>
        }
      />

      <PackageFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        pkg={editingPackage}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingPackage)}
        onOpenChange={(open) => !open && setDeletingPackage(null)}
        title="Delete package?"
        description={
          deletingPackage
            ? `"${deletingPackage.name}" will no longer be available for purchase.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
