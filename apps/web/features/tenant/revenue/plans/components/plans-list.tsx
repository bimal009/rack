"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"

import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog"
import { initialPlans } from "../lib/data"
import type { Plan, PlanInput } from "../lib/schema"
import { createPlanColumns } from "./columns"
import { PlanFormSheet } from "./plan-form-sheet"

const filters = ["All", "Active", "Inactive"] as const

function generateId() {
  return `plan_${Math.random().toString(36).slice(2, 10)}`
}

export function PlansList() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null)

  const visible =
    filter === "All"
      ? plans
      : plans.filter((p) => (filter === "Active" ? p.active : !p.active))

  function handleAdd() {
    setEditingPlan(null)
    setSheetOpen(true)
  }

  function handleEdit(plan: Plan) {
    setEditingPlan(plan)
    setSheetOpen(true)
  }

  function handleSubmit(values: PlanInput) {
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? { ...plan, ...values } : plan
        )
      )
      toast.success(`${values.name} updated`)
    } else {
      setPlans((prev) => [
        { ...values, id: generateId(), members: 0 },
        ...prev,
      ])
      toast.success(`${values.name} created`)
    }
  }

  function handleDelete() {
    if (!deletingPlan) return
    setPlans((prev) => prev.filter((plan) => plan.id !== deletingPlan.id))
    toast.success(`${deletingPlan.name} deleted`)
    setDeletingPlan(null)
  }

  const columns = useMemo(
    () =>
      createPlanColumns({
        onEdit: handleEdit,
        onDelete: setDeletingPlan,
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
        searchPlaceholder="Search plans..."
        emptyMessage="No plans found."
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
              Add Plan
            </Button>
          </>
        }
      />

      <PlanFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        plan={editingPlan}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingPlan)}
        onOpenChange={(open) => !open && setDeletingPlan(null)}
        title="Delete plan?"
        description={
          deletingPlan
            ? `"${deletingPlan.name}" will be removed. Members already on this plan keep their access until it ends.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
