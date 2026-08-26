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

import { generateTypeId } from "../lib/data"
import type { SimpleType, SimpleTypeInput } from "../lib/schema"
import { SimpleTypeFormSheet } from "./simple-type-form-sheet"

interface SimpleTypeListProps {
  label: string
  idPrefix: string
  hasSlug: boolean
  hasRate: boolean
  initialItems: SimpleType[]
}

export function SimpleTypeList({
  label,
  idPrefix,
  hasSlug,
  hasRate,
  initialItems,
}: SimpleTypeListProps) {
  const [items, setItems] = useState<SimpleType[]>(initialItems)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<SimpleType | null>(null)
  const [deleting, setDeleting] = useState<SimpleType | null>(null)

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(item: SimpleType) {
    setEditing(item)
    setSheetOpen(true)
  }

  function handleSubmit(values: SimpleTypeInput) {
    if (editing) {
      setItems((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...i, ...values } : i))
      )
      toast.success(`${values.name} updated`)
    } else {
      setItems((prev) => [
        { ...values, id: generateTypeId(idPrefix) },
        ...prev,
      ])
      toast.success(`${values.name} added`)
    }
  }

  function handleDelete() {
    if (!deleting) return
    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
    toast.success(`${deleting.name} removed`)
    setDeleting(null)
  }

  const columns = useMemo(() => {
    const columnHelper = createDataTableColumnHelper<SimpleType>()
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      columnHelper.accessor("name", { header: "Name" }),
      ...(hasSlug
        ? [
            columnHelper.accessor("slug", {
              header: "Slug",
              enableGlobalFilter: false,
              cell: ({ getValue }: { getValue: () => string | undefined }) => (
                <span className="text-muted-foreground">{getValue()}</span>
              ),
            }),
          ]
        : []),
      ...(hasRate
        ? [
            columnHelper.accessor("rate", {
              header: "Rate",
              enableGlobalFilter: false,
              cell: ({ getValue }: { getValue: () => number | undefined }) =>
                `${getValue() ?? 0}%`,
            }),
          ]
        : []),
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
  }, [hasSlug, hasRate])

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={items}
        getRowId={(row) => row.id}
        searchPlaceholder={`Search ${label.toLowerCase()}s...`}
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add {label}
          </Button>
        }
      />

      <SimpleTypeFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        label={label}
        hasSlug={hasSlug}
        hasRate={hasRate}
        item={editing}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${label.toLowerCase()}?`}
        description={
          deleting ? `"${deleting.name}" will be permanently removed.` : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
