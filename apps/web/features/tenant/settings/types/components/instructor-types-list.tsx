"use client"

import { useMemo, useState } from "react"
import { MoreHorizontal, PenSquare, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

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

import { generateTypeId, initialInstructorTypes } from "../lib/data"
import type {
  InstructorTypeInput,
  InstructorTypeRecord,
} from "../lib/schema"
import { InstructorTypeFormSheet } from "./instructor-type-form-sheet"

export function InstructorTypesList() {
  const [types, setTypes] = useState<InstructorTypeRecord[]>(
    initialInstructorTypes
  )
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<InstructorTypeRecord | null>(null)
  const [deleting, setDeleting] = useState<InstructorTypeRecord | null>(null)

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(type: InstructorTypeRecord) {
    setEditing(type)
    setSheetOpen(true)
  }

  function handleSubmit(values: InstructorTypeInput) {
    if (editing) {
      setTypes((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...values } : t))
      )
      toast.success(`${values.name} updated`)
    } else {
      setTypes((prev) => [
        { ...values, id: generateTypeId("inst") },
        ...prev,
      ])
      toast.success(`${values.name} added`)
    }
  }

  function handleDelete() {
    if (!deleting) return
    setTypes((prev) => prev.filter((t) => t.id !== deleting.id))
    toast.success(`${deleting.name} removed`)
    setDeleting(null)
  }

  const columns = useMemo(() => {
    const columnHelper = createDataTableColumnHelper<InstructorTypeRecord>()
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("slug", {
        header: "Slug",
        enableGlobalFilter: false,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("maxConcurrentBookings", {
        header: "Max Concurrent Bookings",
        enableGlobalFilter: false,
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
        data={types}
        getRowId={(row) => row.id}
        searchPlaceholder="Search instructor types..."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add Instructor Type
          </Button>
        }
      />

      <InstructorTypeFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        type={editing}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete instructor type?"
        description={
          deleting ? `"${deleting.name}" will be permanently removed.` : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
