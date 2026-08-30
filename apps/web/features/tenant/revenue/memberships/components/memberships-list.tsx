"use client"

import { useMemo, useState } from "react"
import { Download, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"
import { initialMemberships } from "../lib/data"
import type { Membership, MembershipInput } from "../lib/schema"
import { createMembershipColumns } from "./columns"
import { MembershipFormSheet } from "./membership-form-sheet"

const filters = ["All", "Active", "Inactive"] as const

function generateId() {
  return `membership_${Math.random().toString(36).slice(2, 10)}`
}

export function MembershipsList() {
  const [memberships, setMemberships] =
    useState<Membership[]>(initialMemberships)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Membership | null>(null)
  const [deleting, setDeleting] = useState<Membership | null>(null)

  const visible =
    filter === "All"
      ? memberships
      : memberships.filter((m) =>
          filter === "Active" ? m.active : !m.active
        )

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(membership: Membership) {
    setEditing(membership)
    setSheetOpen(true)
  }

  function handleSubmit(values: MembershipInput) {
    if (editing) {
      setMemberships((prev) =>
        prev.map((m) => (m.id === editing.id ? { ...m, ...values } : m))
      )
      toast.success(`${values.name} updated`)
    } else {
      setMemberships((prev) => [
        { ...values, id: generateId(), members: 0 },
        ...prev,
      ])
      toast.success(`${values.name} created`)
    }
  }

  function handleDelete() {
    if (!deleting) return
    setMemberships((prev) => prev.filter((m) => m.id !== deleting.id))
    toast.success(`${deleting.name} deleted`)
    setDeleting(null)
  }

  function handleExport() {
    exportToCsv(
      "memberships.csv",
      visible.map((m) => ({
        Name: m.name,
        Category: m.category,
        Price: m.pricePerPeriod,
        "Billing Type": m.billingType,
        Members: m.members,
        Status: m.active ? "Active" : "Inactive",
      }))
    )
  }

  const columns = useMemo(
    () =>
      createMembershipColumns({
        onEdit: handleEdit,
        onDelete: setDeleting,
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
        searchPlaceholder="Search memberships..."
        emptyMessage="No memberships found."
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
              Add Membership
            </Button>
          </>
        }
      />

      <MembershipFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        membership={editing}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete membership?"
        description={
          deleting
            ? `"${deleting.name}" will be removed. Members already on this membership keep their access until it ends.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
