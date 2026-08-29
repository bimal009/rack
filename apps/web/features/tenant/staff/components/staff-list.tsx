"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Download, Plus, SearchIcon } from "lucide-react"
import { gymRoleEnumSchema, type GymRole, type StaffListQuery } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { Input } from "@repo/ui/components/ui/input"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { useDebounce } from "@/hooks/use-debounce"

import { useStaffListQuery } from "../hooks/use-staff"
import { useStaffFilters } from "../hooks/use-staff-filters"
import { gymRoleLabel } from "../lib/roles"
import { createStaffDirectoryColumns } from "./directory-columns"
import { StaffCreateSheet } from "./staff-create-sheet"

const roleOptions = ["All", ...gymRoleEnumSchema.options.map(gymRoleLabel)] as const

export function StaffList() {
  const tenant = useParams<{ tenant: string }>().tenant
  const [filters, setFilters] = useStaffFilters()
  const [sheetOpen, setSheetOpen] = useState(false)

  const debouncedSearch = useDebounce(filters.search, 350)

  const params: StaffListQuery = {
    page: filters.page,
    search: debouncedSearch || undefined,
    role: filters.role ?? undefined,
    status: filters.status ?? undefined,
    sortOrder: filters.sortOrder,
  }

  const query = useStaffListQuery(tenant, params)

  const columns = useMemo(() => createStaffDirectoryColumns(), [])

  const rows = query.data?.data ?? []
  const meta = query.data?.meta
  const activeRoleLabel = filters.role ? gymRoleLabel(filters.role) : "All"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FilterPills
          options={roleOptions}
          value={activeRoleLabel}
          onChange={(label) => {
            const role =
              gymRoleEnumSchema.options.find(
                (r) => gymRoleLabel(r) === label
              ) ?? null
            setFilters({ role: role as GymRole | null, page: 1 })
          }}
        />
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
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
            <Button variant="outline" disabled className="flex-1 sm:flex-none">
              <Download className="size-4" />
              Export
            </Button>
            <Button
              onClick={() => setSheetOpen(true)}
              className="flex-1 sm:flex-none"
            >
              <Plus className="size-4" />
              Add Staff
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

      <StaffCreateSheet
        tenant={tenant}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
