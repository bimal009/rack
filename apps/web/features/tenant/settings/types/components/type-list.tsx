"use client"

import { useMemo, useState, type ReactNode } from "react"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  MoreHorizontal,
  PenSquare,
  Plus,
  SearchIcon,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import type { PaginatedResponse } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import {
  createDataTableColumnHelper,
  createIndexColumn,
  DataTable,
  type DataTableColumnDef,
} from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Input } from "@repo/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"

import { useDebounce } from "@/hooks/use-debounce"
import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"

import { useTypeFilters } from "../hooks/use-type-filters"

const PAGE_SIZES = [10, 20, 30, 50]

export type ListQuery = {
  page: number
  limit: number
  search?: string
  sortOrder: "asc" | "desc"
}

export type QueryLike<TRow> = {
  data?: PaginatedResponse<TRow>
  isLoading: boolean
  isError: boolean
  isPlaceholderData: boolean
  error: unknown
}

export type MutationLike<TVars> = {
  mutate: (
    vars: TVars,
    opts?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => void
  isPending: boolean
}

export interface RowActions<TRow> {
  onEdit: (row: TRow) => void
  onDelete: (row: TRow) => void
}

export interface FormRenderProps<TRow, TInput> {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: TRow | null
  pending: boolean
  onSubmit: (values: TInput) => void
}

interface TypeListProps<TRow extends { id: string; name: string }, TInput> {
  label: string
  buildColumns: (actions: RowActions<TRow>) => DataTableColumnDef<TRow>[]
  useList: (tenant: string, query: ListQuery) => QueryLike<TRow>
  useCreate: (tenant: string) => MutationLike<TInput>
  useUpdate: (
    tenant: string
  ) => MutationLike<{ id: string; input: Partial<TInput> }>
  useDelete: (tenant: string) => MutationLike<string>
  renderForm: (props: FormRenderProps<TRow, TInput>) => ReactNode
}

export function TypeList<TRow extends { id: string; name: string }, TInput>({
  label,
  buildColumns,
  useList,
  useCreate,
  useUpdate,
  useDelete,
  renderForm,
}: TypeListProps<TRow, TInput>) {
  const tenant = useParams<{ tenant: string }>().tenant

  const [filters, setFilters] = useTypeFilters()
  const debouncedSearch = useDebounce(filters.search, 350)

  const query = useList(tenant, {
    page: filters.page,
    limit: filters.limit,
    search: debouncedSearch || undefined,
    sortOrder: filters.sort,
  })
  const create = useCreate(tenant)
  const update = useUpdate(tenant)
  const remove = useDelete(tenant)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<TRow | null>(null)
  const [deleting, setDeleting] = useState<TRow | null>(null)

  const rows = query.data?.data ?? []
  const meta = query.data?.meta
  const totalPages = Math.max(meta?.totalPages ?? 1, 1)

  function handleSubmit(values: TInput) {
    if (editing) {
      update.mutate(
        { id: editing.id, input: values },
        {
          onSuccess: () => {
            toast.success(`${editing.name} updated`)
            setSheetOpen(false)
          },
          onError: (error) => toast.error(error.message),
        }
      )
    } else {
      create.mutate(values, {
        onSuccess: () => {
          toast.success(`${label} added`)
          setSheetOpen(false)
        },
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
    const columnHelper = createDataTableColumnHelper<TRow>()
    return [
      createIndexColumn(columnHelper),
      ...buildColumns({
        onEdit: (row) => {
          setEditing(row)
          setSheetOpen(true)
        },
        onDelete: (row) => setDeleting(row),
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
    ]
  }, [buildColumns])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
            placeholder={`Search ${label.toLowerCase()}s...`}
            className="rounded-full pl-9 shadow-none"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            <ListFilter className="size-4" />
            Filter
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={filters.sort}
              onValueChange={(value) =>
                setFilters({ sort: value as "asc" | "desc", page: 1 })
              }
            >
              <DropdownMenuLabel>Sort order</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="asc">A → Z</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Z → A</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="ml-auto"
          onClick={() => {
            setEditing(null)
            setSheetOpen(true)
          }}
        >
          <Plus className="size-4" />
          Add {label}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        isLoading={query.isLoading}
        enableSearch={false}
        enablePagination={false}
        emptyMessage={
          query.isError
            ? (query.error as Error).message
            : `No ${label.toLowerCase()}s yet.`
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(filters.limit)}
            onValueChange={(value) =>
              setFilters({ limit: Number(value), page: 1 })
            }
          >
            <SelectTrigger size="sm" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium whitespace-nowrap">
            Page {meta?.page ?? filters.page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={(meta?.page ?? 1) <= 1 || query.isPlaceholderData}
              onClick={() => setFilters({ page: filters.page - 1 })}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={
                (meta?.page ?? 1) >= totalPages || query.isPlaceholderData
              }
              onClick={() => setFilters({ page: filters.page + 1 })}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {renderForm({
        open: sheetOpen,
        onOpenChange: setSheetOpen,
        item: editing,
        pending: create.isPending || update.isPending,
        onSubmit: handleSubmit,
      })}

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
