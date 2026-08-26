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
import type { StaffInput, StaffMember } from "../lib/schema"
import { fullName } from "./columns"
import { createInstructorColumns } from "./instructor-columns"
import { StaffFormSheet } from "./staff-form-sheet"

const filters = ["All", "Active", "Inactive"] as const

function today() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const date = new Date()
  return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

export function InstructorsList() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null)

  const instructors = staff.filter((s) => s.role === "Instructor")
  const visible =
    filter === "All"
      ? instructors
      : instructors.filter((s) =>
          filter === "Active" ? s.activeInstructor : !s.activeInstructor
        )

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
      "instructors.csv",
      visible.map((member) => ({
        Name: member.displayName || fullName(member),
        Email: member.email,
        Type: member.instructorType,
        Sports: member.sports ?? "",
        "Pay Type": member.payType,
        "Pay Rate": member.payRate,
        Bookable: member.canBeBooked ? "Yes" : "No",
        Visibility: member.visibility,
        Status: member.activeInstructor ? "Active" : "Inactive",
      }))
    )
  }

  const columns = useMemo(
    () =>
      createInstructorColumns({
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
        searchPlaceholder="Search by name or email..."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add Instructor
          </Button>
        }
      />

      <StaffFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        staff={editingStaff}
        defaultRole="Instructor"
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingStaff)}
        onOpenChange={(open) => !open && setDeletingStaff(null)}
        title="Remove instructor?"
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
