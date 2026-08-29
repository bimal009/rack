"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { MoreHorizontal, PenSquare, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { InstructorTypeRecord, NewInstructorType } from "@repo/types"

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

import {
  useCreateInstructorType,
  useDeleteInstructorType,
  useInstructorTypesQuery,
  useUpdateInstructorType,
} from "../hooks/use-instructor-types"
import { InstructorTypeFormSheet } from "./instructor-type-form-sheet"

export function InstructorTypesList() {
  const tenant = useParams<{ tenant: string }>().tenant
  const query = useInstructorTypesQuery(tenant)
  const create = useCreateInstructorType(tenant)
  const update = useUpdateInstructorType(tenant)
  const remove = useDeleteInstructorType(tenant)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<InstructorTypeRecord | null>(null)
  const [deleting, setDeleting] = useState<InstructorTypeRecord | null>(null)

  function handleSubmit(values: NewInstructorType) {
    if (editing) {
      update.mutate(
        { id: editing.id, input: values },
        {
          onSuccess: () => toast.success(`${values.name} updated`),
          onError: (error) => toast.error(error.message),
        }
      )
    } else {
      create.mutate(values, {
        onSuccess: () => toast.success(`${values.name} added`),
        onError: (error) => toast.error(error.message),
      })
    }
  }

  function handleDelete() {
    if (!deleting) return
    remove.mutate(deleting.id, {
      onSuccess: () => toast.success(`${deleting.name} removed`),
      onError: (error) => toast.error(error.message),
    })
    setDeleting(null)
  }

  const columns = useMemo(() => {
    const columnHelper = createDataTableColumnHelper<InstructorTypeRecord>()
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      columnHelper.accessor("name", { header: "Name" }),
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
              <DropdownMenuItem
                onClick={() => {
                  setEditing(row.original)
                  setSheetOpen(true)
                }}
              >
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
        data={query.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        searchPlaceholder="Search instructor types..."
        emptyMessage={
          query.isError
            ? (query.error as Error).message
            : "No instructor types yet."
        }
        toolbar={
          <Button
            onClick={() => {
              setEditing(null)
              setSheetOpen(true)
            }}
          >
            <Plus className="size-4" />
            Add Instructor Type
          </Button>
        }
      />

      <InstructorTypeFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        type={editing}
        pending={create.isPending || update.isPending}
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
