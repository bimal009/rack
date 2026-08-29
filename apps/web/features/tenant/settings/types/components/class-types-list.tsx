"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { MoreHorizontal, PenSquare, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { ClassType, NewClassType } from "@repo/types"

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

import {
  useClassTypesQuery,
  useCreateClassType,
  useDeleteClassType,
  useUpdateClassType,
} from "../hooks/use-class-types"
import { ClassTypeFormSheet } from "./class-type-form-sheet"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

export function ClassTypesList() {
  const tenant = useParams<{ tenant: string }>().tenant
  const query = useClassTypesQuery(tenant)
  const create = useCreateClassType(tenant)
  const update = useUpdateClassType(tenant)
  const remove = useDeleteClassType(tenant)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<ClassType | null>(null)
  const [deleting, setDeleting] = useState<ClassType | null>(null)

  function handleSubmit(values: NewClassType) {
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
    const columnHelper = createDataTableColumnHelper<ClassType>()
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("availableForBooking", {
        header: "Bookable",
        enableGlobalFilter: false,
        cell: ({ getValue }) => (
          <Badge
            variant={getValue() ? "default" : "secondary"}
            className="rounded-full"
          >
            {getValue() ? "Yes" : "No"}
          </Badge>
        ),
      }),
      columnHelper.accessor("pricePerClass", {
        header: "Price / class",
        enableGlobalFilter: false,
        cell: ({ getValue }) => currency.format(getValue()),
      }),
      columnHelper.accessor("maxParticipants", {
        header: "Max Participants",
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
        searchPlaceholder="Search class types..."
        emptyMessage={
          query.isError
            ? (query.error as Error).message
            : "No class types yet."
        }
        toolbar={
          <Button
            onClick={() => {
              setEditing(null)
              setSheetOpen(true)
            }}
          >
            <Plus className="size-4" />
            Add Class Type
          </Button>
        }
      />

      <ClassTypeFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        type={editing}
        pending={create.isPending || update.isPending}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete class type?"
        description={
          deleting ? `"${deleting.name}" will be permanently removed.` : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
