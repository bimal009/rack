"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"

import { initialStaff } from "../lib/data"
import { payTypes, type StaffInput, type StaffMember } from "../lib/schema"
import { fullName } from "./columns"
import { createPayrollColumns } from "./payroll-columns"
import { StaffFormSheet } from "./staff-form-sheet"

const filters = ["All", ...payTypes] as const

export function PayrollList() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  const visible =
    filter === "All" ? staff : staff.filter((s) => s.payType === filter)

  function handleEdit(member: StaffMember) {
    setEditingStaff(member)
    setSheetOpen(true)
  }

  function handleSubmit(values: StaffInput) {
    if (!editingStaff) return
    setStaff((prev) =>
      prev.map((member) =>
        member.id === editingStaff.id ? { ...member, ...values } : member
      )
    )
    toast.success(`${fullName(values)}'s pay updated`)
  }

  function handleExport() {
    exportToCsv(
      "payroll.csv",
      visible.map((member) => ({
        Name: fullName(member),
        Role: member.role,
        "Pay Type": member.payType,
        "Pay Rate": member.payRate,
        Status: member.status,
      }))
    )
  }

  const columns = useMemo(
    () => createPayrollColumns({ onEdit: handleEdit }),
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
        searchPlaceholder="Search by name..."
      />

      <StaffFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        staff={editingStaff}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
