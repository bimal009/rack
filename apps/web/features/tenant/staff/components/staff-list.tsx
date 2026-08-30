"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Plus,
  SearchIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  gymRoleEnumSchema,
  type GymRole,
  type StaffListQuery,
  type StaffWithUser,
} from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Input } from "@repo/ui/components/ui/input"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"
import { useDebounce } from "@/hooks/use-debounce"

import { useInstructorTypesQuery } from "@/features/tenant/settings/types/hooks/use-instructor-types"

import { useDeleteStaffMutation, useStaffListQuery } from "../hooks/use-staff"
import { useStaffFilters } from "../hooks/use-staff-filters"
import { gymRoleLabel } from "../lib/roles"
import { createStaffDirectoryColumns } from "./directory-columns"
import { StaffFormSheet } from "./staff-form-sheet"

const roleOptions = ["All", ...gymRoleEnumSchema.options.map(gymRoleLabel)] as const
const statusOptions = ["All", "Active", "Inactive"] as const

interface StaffListProps {
  lockedRole?: GymRole
  label?: string
}

export function StaffList({ lockedRole, label = "Staff" }: StaffListProps = {}) {
  const tenant = useParams<{ tenant: string }>().tenant
  const [filters, setFilters] = useStaffFilters()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<StaffWithUser | null>(null)
  const [deleting, setDeleting] = useState<StaffWithUser | null>(null)

  const deleteStaff = useDeleteStaffMutation(tenant)

  const debouncedSearch = useDebounce(filters.search, 350)

  const params: Partial<StaffListQuery> = {
    page: filters.page,
    search: debouncedSearch || undefined,
    role: lockedRole ?? filters.role ?? undefined,
    status: filters.status ?? undefined,
    sortOrder: filters.sort,
  }

  const query = useStaffListQuery(tenant, params)

  const isInstructorView = lockedRole === "instructor"
  const instructorTypes = useInstructorTypesQuery(tenant, { limit: 100 })

  const columns = useMemo(() => {
    const rowActions = {
      onEdit: (row: StaffWithUser) => {
        setEditing(row)
        setSheetOpen(true)
      },
      onDelete: (row: StaffWithUser) => setDeleting(row),
    }
    if (!isInstructorView) return createStaffDirectoryColumns(rowActions)
    const map = new Map(
      (instructorTypes.data?.data ?? []).map((t) => [t.id, t.name])
    )
    return createStaffDirectoryColumns({
      ...rowActions,
      instructor: true,
      instructorTypeName: (id) => (id ? (map.get(id) ?? "") : ""),
    })
  }, [isInstructorView, instructorTypes.data])

  const rows = query.data?.data ?? []
  const meta = query.data?.meta
  const activeRoleLabel = filters.role ? gymRoleLabel(filters.role) : "All"
  const activeStatusLabel = filters.status
    ? filters.status === "active"
      ? "Active"
      : "Inactive"
    : "All"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full min-w-0 lg:w-auto">
          {!lockedRole ? (
            <FilterPills
              options={roleOptions}
              value={activeRoleLabel}
              onChange={(value) => {
                const role =
                  gymRoleEnumSchema.options.find(
                    (r) => gymRoleLabel(r) === value
                  ) ?? null
                setFilters({ role: role as GymRole | null, page: 1 })
              }}
            />
          ) : (
            <FilterPills
              options={statusOptions}
              value={activeStatusLabel}
              onChange={(value) =>
                setFilters({
                  status:
                    value === "Active"
                      ? "active"
                      : value === "Inactive"
                        ? "inactive"
                        : null,
                  page: 1,
                })
              }
            />
          )}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              placeholder="Search by name or email..."
              className="rounded-full pl-9 shadow-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" className="flex-1 sm:flex-none" />}
              >
                <ListFilter className="size-4" />
                Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {!lockedRole && (
                  <>
                    <DropdownMenuRadioGroup
                      value={filters.status ?? "all"}
                      onValueChange={(value) =>
                        setFilters({
                          status:
                            value === "all"
                              ? null
                              : (value as "active" | "inactive"),
                          page: 1,
                        })
                      }
                    >
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="all">
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="active">
                        Active
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="inactive">
                        Inactive
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuRadioGroup
                  value={filters.sort}
                  onValueChange={(value) =>
                    setFilters({ sort: value as "asc" | "desc", page: 1 })
                  }
                >
                  <DropdownMenuLabel>Sort by joined</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="desc">
                    Newest first
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">
                    Oldest first
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => {
                setEditing(null)
                setSheetOpen(true)
              }}
              className="flex-1 sm:flex-none"
            >
              <Plus className="size-4" />
              Add {label}
            </Button>
          </div>
        </div>
      </div>

      {query.isError ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {(query.error as Error).message}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          enableSearch={false}
          enablePagination={false}
          isLoading={query.isLoading}
          skeletonRows={8}
          emptyMessage="No staff found."
        />
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={meta.page <= 1 || query.isPlaceholderData}
              onClick={() => setFilters({ page: meta.page - 1 })}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={meta.page >= meta.totalPages || query.isPlaceholderData}
              onClick={() => setFilters({ page: meta.page + 1 })}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <StaffFormSheet
        tenant={tenant}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setEditing(null)
        }}
        staff={editing}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove staff member?"
        description={
          deleting
            ? `${deleting.user.name} will be removed from this gym.`
            : ""
        }
        onConfirm={() => {
          if (!deleting) return
          deleteStaff.mutate(deleting.id, {
            onSuccess: () => toast.success(`${deleting.user.name} removed`),
            onError: (error) => toast.error(error.message),
          })
          setDeleting(null)
        }}
      />
    </div>
  )
}
