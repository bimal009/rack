"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog"
import type { Plan, PlanInput } from "../lib/schema"
import { createPlanColumns } from "./columns"
import { PlanFormSheet } from "./plan-form-sheet"

const initialPlans: Plan[] = [
  {
    id: "plan_1",
    name: "Gold Membership",
    category: "Individual",
    barcode: "",
    visibility: "Public",
    description: "Full access to all classes, equipment, and locker rooms.",
    active: true,
    pricePerPeriod: 7900,
    billingType: "Monthly",
    signupFee: 1000,
    requirePaymentUpfront: true,
    coverage: "Full facility access",
    sessions: "",
    features: "Personal Training",
    sports: "",
    members: 112,
  },
  {
    id: "plan_2",
    name: "Silver Membership",
    category: "Individual",
    barcode: "",
    visibility: "Public",
    description: "Access to gym floor and open classes.",
    active: true,
    pricePerPeriod: 4900,
    billingType: "Monthly",
    signupFee: 0,
    requirePaymentUpfront: true,
    coverage: "General plan",
    sessions: "",
    features: "Group Classes",
    sports: "",
    members: 86,
  },
  {
    id: "plan_3",
    name: "Annual Elite",
    category: "Individual",
    barcode: "",
    visibility: "Public",
    description: "Best value plan with personal training sessions included.",
    active: true,
    pricePerPeriod: 72000,
    billingType: "Annual",
    signupFee: 0,
    requirePaymentUpfront: true,
    coverage: "Full facility access",
    sessions: "",
    features: "Personal Training",
    sports: "",
    members: 34,
  },
  {
    id: "plan_4",
    name: "Student Quarterly",
    category: "Student",
    barcode: "",
    visibility: "Public",
    description: "Discounted plan for verified students.",
    active: false,
    pricePerPeriod: 9900,
    billingType: "Quarterly",
    signupFee: 0,
    requirePaymentUpfront: true,
    coverage: "General plan",
    sessions: "",
    features: "",
    sports: "",
    members: 0,
  },
  {
    id: "plan_5",
    name: "Family Pack",
    category: "Family",
    barcode: "",
    visibility: "Private",
    description: "Shared plan for up to 4 family members.",
    active: true,
    pricePerPeriod: 15900,
    billingType: "Monthly",
    signupFee: 1500,
    requirePaymentUpfront: false,
    coverage: "Full facility access",
    sessions: "",
    features: "Locker",
    sports: "",
    members: 16,
  },
]

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
