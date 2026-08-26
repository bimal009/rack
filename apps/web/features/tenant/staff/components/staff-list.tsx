"use client"

import { useMemo, useState } from "react"
import { Download, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"

import { generateStaffId, initialStaff } from "../lib/data"
import { staffRoles, type StaffInput, type StaffMember } from "../lib/schema"
import { createStaffColumns, fullName } from "./columns"
import { StaffFormSheet } from "./staff-form-sheet"

const filters = ["All", ...staffRoles] as const

function today() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const date = new Date()
  return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

export function StaffList() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null)

  const visible =
    filter === "All" ? staff : staff.filter((s) => s.role === filter)

  function handleAdd() {
    setEditingStaff(null)
    setSheetOpen(true)
  }

  function handleEdit(member: StaffMember) {
    setEditingStaff(member)
    setSheetOpen(true)
  }

  function handleSubmit(values: StaffInput) {
    if (editingStaff) {
      setStaff((prev) =>
        prev.map((member) =>
          member.id === editingStaff.id ? { ...member, ...values } : member
        )
      )
      toast.success(`${fullName(values)} updated`)
    } else {
      setStaff((prev) => [
        {
          ...values,
          id: generateStaffId(),
          joined: today(),
          status: "Active",
        },
        ...prev,
      ])
      toast.success(`${fullName(values)} added`)
    }
  }

  function handleDelete() {
    if (!deletingStaff) return
    setStaff((prev) => prev.filter((member) => member.id !== deletingStaff.id))
    toast.success(`${fullName(deletingStaff)} removed`)
    setDeletingStaff(null)
  }

  function handleExport() {
    exportToCsv(
      "staff.csv",
      visible.map((member) => ({
        Name: fullName(member),
        Email: member.email,
        Phone: member.phone,
        Role: member.role,
        Specialty: member.specialty ?? "",
        "Pay Type": member.payType,
        "Pay Rate": member.payRate,
        Joined: member.joined,
        Status: member.status,
      }))
    )
  }

  const columns = useMemo(
    () =>
      createStaffColumns({
        onEdit: handleEdit,
        onDelete: setDeletingStaff,
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
        searchPlaceholder="Search by name or email..."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add Staff
          </Button>
        }
      />

      <StaffFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        staff={editingStaff}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingStaff)}
        onOpenChange={(open) => !open && setDeletingStaff(null)}
        title="Remove staff member?"
        description={
          deletingStaff
            ? `"${fullName(deletingStaff)}" will be removed from your staff list.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
