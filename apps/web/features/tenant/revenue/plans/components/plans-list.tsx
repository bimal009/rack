"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Download, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import type { MembershipPlan, NewMembershipPlan } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"

import {
  useCreateMembershipPlan,
  useDeleteMembershipPlan,
  useMembershipPlansQuery,
  useUpdateMembershipPlan,
} from "../hooks/use-memberships"
import { createMembershipColumns } from "./columns"
import { MembershipFormSheet } from "./membership-form-sheet"

const filters = ["All", "Active", "Inactive"] as const

export function MembershipsList() {
  const tenant = useParams<{ tenant: string }>().tenant

  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<MembershipPlan | null>(null)
  const [deleting, setDeleting] = useState<MembershipPlan | null>(null)

  const membershipsQuery = useMembershipPlansQuery(tenant, {
    limit: 100,
    isActive: filter === "All" ? undefined : filter === "Active",
  })
  const createMembership = useCreateMembershipPlan(tenant)
  const updateMembership = useUpdateMembershipPlan(tenant)
  const deleteMembership = useDeleteMembershipPlan(tenant)

  const rows = membershipsQuery.data?.data ?? []

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(membership: MembershipPlan) {
    setEditing(membership)
    setSheetOpen(true)
  }

  function handleSubmit(values: NewMembershipPlan) {
    if (editing) {
      updateMembership.mutate(
        { id: editing.id, input: values },
        {
          onSuccess: () => toast.success(`${values.name} updated`),
          onError: (error) => toast.error(error.message),
        }
      )
    } else {
      createMembership.mutate(values, {
        onSuccess: () => toast.success(`${values.name} created`),
        onError: (error) => toast.error(error.message),
      })
    }
  }

  function handleDelete() {
    if (!deleting) return
    const name = deleting.name
    deleteMembership.mutate(deleting.id, {
      onSuccess: () => toast.success(`${name} deleted`),
      onError: (error) => toast.error(error.message),
    })
    setDeleting(null)
  }

  function handleExport() {
    exportToCsv(
      "memberships.csv",
      rows.map((m) => ({
        Name: m.name,
        Category: m.category.name,
        Price: m.pricePerPeriod,
        "Billing Type": m.billingType,
        "Billing Interval Unit": m.billingIntervalUnit ?? "",
        "Billing Interval Count": m.billingIntervalCount ?? "",
        Visibility: m.visibility,
        Status: m.isActive ? "Active" : "Inactive",
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
        data={rows}
        getRowId={(row) => row.id}
        enableRowSelection
        isLoading={membershipsQuery.isPending}
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
        pending={createMembership.isPending || updateMembership.isPending}
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
