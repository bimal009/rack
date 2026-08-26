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

import { generateTypeId, initialClassTypes } from "../lib/data"
import type { ClassType, ClassTypeInput } from "../lib/schema"
import { ClassTypeFormSheet } from "./class-type-form-sheet"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

export function ClassTypesList() {
  const [classes, setClasses] = useState<ClassType[]>(initialClassTypes)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<ClassType | null>(null)
  const [deleting, setDeleting] = useState<ClassType | null>(null)

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(cls: ClassType) {
    setEditing(cls)
    setSheetOpen(true)
  }

  function handleSubmit(values: ClassTypeInput) {
    if (editing) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...values } : c))
      )
      toast.success(`${values.name} updated`)
    } else {
      setClasses((prev) => [
        { ...values, id: generateTypeId("class") },
        ...prev,
      ])
      toast.success(`${values.name} added`)
    }
  }

  function handleDelete() {
    if (!deleting) return
    setClasses((prev) => prev.filter((c) => c.id !== deleting.id))
    toast.success(`${deleting.name} removed`)
    setDeleting(null)
  }

  const columns = useMemo(() => {
    const columnHelper = createDataTableColumnHelper<ClassType>()
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
      columnHelper.accessor("availableForBooking", {
        header: "Bookable",
        enableGlobalFilter: false,
        cell: ({ getValue }) => (
          <Badge
            variant={getValue() ? "default" : "secondary"}
            className="rounded-full"
          >
            {getValue() ? "Active" : "Inactive"}
          </Badge>
        ),
      }),
      columnHelper.accessor("pricePerClass", {
        header: "Price/Class",
        enableGlobalFilter: false,
        cell: ({ getValue }) => currency.format(getValue()),
      }),
      columnHelper.accessor("sports", {
        header: "Sport",
        enableGlobalFilter: false,
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge variant="outline" className="rounded-full font-normal">
              {getValue()}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
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
        data={classes}
        getRowId={(row) => row.id}
        searchPlaceholder="Search class types..."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add Class Type
          </Button>
        }
      />

      <ClassTypeFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        cls={editing}
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
