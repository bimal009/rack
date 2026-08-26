"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog"
import type { Package, PackageInput } from "../lib/schema"
import { createPackageColumns } from "./columns"
import { PackageFormSheet } from "./package-form-sheet"

const initialPackages: Package[] = [
  { id: "pkg_1", name: "5 Session Pack", sessions: 5, price: 89, validityDays: 45, status: "Active" },
  { id: "pkg_2", name: "10 Session Pack", sessions: 10, price: 159, validityDays: 90, status: "Active" },
  { id: "pkg_3", name: "20 Session Pack", sessions: 20, price: 289, validityDays: 180, status: "Active" },
  { id: "pkg_4", name: "Personal Training x4", sessions: 4, price: 220, validityDays: 30, status: "Active" },
  { id: "pkg_5", name: "Trial Pack", sessions: 2, price: 29, validityDays: 14, status: "Draft" },
]

const filters = ["All", "Active", "Draft", "Archived"] as const

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
      : packages.filter((p) => p.status === filter)

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
