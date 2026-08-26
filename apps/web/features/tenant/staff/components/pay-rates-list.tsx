"use client"

import { useMemo, useState } from "react"
import { MoreHorizontal, PenSquare, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  createDataTableColumnHelper,
  createIndexColumn,
  DataTable,
} from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"

import { generatePayRateId, initialPayRatePolicies } from "../lib/pay-rate-data"
import type { PayRatePolicy, PayRatePolicyInput } from "../lib/pay-rate-schema"
import { PayRateFormSheet } from "./pay-rate-form-sheet"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function earningsLabel(policy: PayRatePolicy) {
  const parts: string[] = []
  if (policy.perClassRate) parts.push(`${currency.format(policy.perClassRate)}/class`)
  if (policy.perPersonRate) parts.push(`${currency.format(policy.perPersonRate)}/person`)
  if (policy.perSessionRate) parts.push(`${currency.format(policy.perSessionRate)}/session`)
  if (policy.revenueSharePercent) parts.push(`${policy.revenueSharePercent}% revenue`)
  return parts.length > 0 ? parts.join(" + ") : "—"
}

export function PayRatesList() {
  const [policies, setPolicies] = useState<PayRatePolicy[]>(
    initialPayRatePolicies
  )
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<PayRatePolicy | null>(null)
  const [deleting, setDeleting] = useState<PayRatePolicy | null>(null)

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(policy: PayRatePolicy) {
    setEditing(policy)
    setSheetOpen(true)
  }

  function handleSubmit(values: PayRatePolicyInput) {
    if (editing) {
      setPolicies((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...values } : p))
      )
      toast.success(`${values.policyName} updated`)
    } else {
      setPolicies((prev) => [
        { ...values, id: generatePayRateId() },
        ...prev,
      ])
      toast.success(`${values.policyName} added`)
    }
  }

  function handleDelete() {
    if (!deleting) return
    setPolicies((prev) => prev.filter((p) => p.id !== deleting.id))
    toast.success(`${deleting.policyName} removed`)
    setDeleting(null)
  }

  const columns = useMemo(() => {
    const columnHelper = createDataTableColumnHelper<PayRatePolicy>()
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      columnHelper.accessor("policyName", { header: "Policy" }),
      columnHelper.accessor("mode", {
        header: "Type",
        enableGlobalFilter: false,
        cell: ({ getValue }) => (
          <Badge variant="outline" className="rounded-full font-normal">
            {getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor((row) => earningsLabel(row), {
        id: "earnings",
        header: "Earnings",
        enableGlobalFilter: false,
      }),
      columnHelper.accessor("appliesToRole", {
        header: "Applies To",
        enableGlobalFilter: false,
      }),
      columnHelper.accessor("compensateUnpaidBookings", {
        header: "Unpaid Bookings",
        enableGlobalFilter: false,
        cell: ({ getValue }) => (
          <Badge
            variant={getValue() ? "default" : "secondary"}
            className="rounded-full"
          >
            {getValue() ? "Compensated" : "Not Compensated"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <PenSquare />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleting(row.original)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ])
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={policies}
        getRowId={(row) => row.id}
        searchPlaceholder="Search pay rate policies..."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add Pay Rate
          </Button>
        }
      />

      <PayRateFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        policy={editing}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete pay rate policy?"
        description={
          deleting
            ? `"${deleting.policyName}" will be permanently removed.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
