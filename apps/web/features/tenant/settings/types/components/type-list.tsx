"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import {
  LayoutGrid,
  MoreHorizontal,
  PenSquare,
  Percent,
  Plus,
  Tag,
  Trash2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
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

import { SimpleTypeFormSheet } from "./simple-type-form-sheet"

const iconMap = { LayoutGrid, Percent, Tag } satisfies Record<string, LucideIcon>
export type SimpleTypeIconName = keyof typeof iconMap

export interface SimpleRow {
  id: string
  name: string
  rate?: number
}

export interface SimpleTypeInput {
  name: string
  rate?: number
}

type QueryLike = {
  data?: SimpleRow[]
  isLoading: boolean
  isError: boolean
  error: unknown
}

type MutationLike<TVars> = {
  mutate: (
    vars: TVars,
    opts?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => void
  isPending: boolean
}

interface SimpleTypeListProps {
  label: string
  icon: SimpleTypeIconName
  hasRate?: boolean
  useList: (tenant: string) => QueryLike
  useCreate: (tenant: string) => MutationLike<SimpleTypeInput>
  useUpdate: (
    tenant: string
  ) => MutationLike<{ id: string; input: Partial<SimpleTypeInput> }>
  useDelete: (tenant: string) => MutationLike<string>
}

export function SimpleTypeList({
  label,
  icon,
  hasRate = false,
  useList,
  useCreate,
  useUpdate,
  useDelete,
}: SimpleTypeListProps) {
  const Icon = iconMap[icon]
  const tenant = useParams<{ tenant: string }>().tenant

  const query = useList(tenant)
  const create = useCreate(tenant)
  const update = useUpdate(tenant)
  const remove = useDelete(tenant)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<SimpleRow | null>(null)
  const [deleting, setDeleting] = useState<SimpleRow | null>(null)

  function handleSubmit(values: SimpleTypeInput) {
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
    const columnHelper = createDataTableColumnHelper<SimpleRow>()
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      columnHelper.accessor("name", { header: "Name" }),
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
  }, [hasRate])

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={query.data ?? []}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        searchPlaceholder={`Search ${label.toLowerCase()}s...`}
        emptyMessage={
          query.isError
            ? (query.error as Error).message
            : `No ${label.toLowerCase()}s yet.`
        }
        toolbar={
          <Button
            onClick={() => {
              setEditing(null)
              setSheetOpen(true)
            }}
          >
            <Plus className="size-4" />
            Add {label}
          </Button>
        }
      />

      <SimpleTypeFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        icon={Icon}
        label={label}
        hasRate={hasRate}
        item={editing}
        pending={create.isPending || update.isPending}
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
