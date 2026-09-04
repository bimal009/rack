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
import type { GymPlan, GymPlanListQuery, NewGymPlan } from "@repo/types"

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
import { useMembershipCategoriesQuery } from "@/features/tenant/settings/types/hooks/use-membership-categories"
import { useDebounce } from "@/hooks/use-debounce"

import {
  useCreateGymPlan,
  useDeleteGymPlan,
  useGymPlansQuery,
  useUpdateGymPlan,
} from "../hooks/use-plans"
import { usePlanFilters } from "../hooks/use-plan-filters"
import { createGymPlanColumns } from "./columns"
import { PlanFormSheet } from "./plan-form-sheet"

export function PlansList() {
  const tenant = useParams<{ tenant: string }>().tenant
  const [filters, setFilters] = usePlanFilters()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<GymPlan | null>(null)
  const [deleting, setDeleting] = useState<GymPlan | null>(null)

  const categories = useMembershipCategoriesQuery(tenant, { limit: 100 })
  const debouncedSearch = useDebounce(filters.search, 350)

  const params: Partial<GymPlanListQuery> = {
    page: filters.page,
    search: debouncedSearch || undefined,
    categoryId: filters.categoryId ?? undefined,
    isActive: filters.status ? filters.status === "active" : undefined,
    sortOrder: filters.sort,
  }

  const query = useGymPlansQuery(tenant, params)
  const createPlan = useCreateGymPlan(tenant)
  const updatePlan = useUpdateGymPlan(tenant)
  const deletePlan = useDeleteGymPlan(tenant)

  const rows = query.data?.data ?? []
  const meta = query.data?.meta

  const categoryOptions = ["All", ...(categories.data?.data.map((c) => c.name) ?? [])]
  const activeCategoryLabel = filters.categoryId
    ? (categories.data?.data.find((c) => c.id === filters.categoryId)?.name ?? "All")
    : "All"

  function handleAdd() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(plan: GymPlan) {
    setEditing(plan)
    setSheetOpen(true)
  }

  function handleSubmit(values: NewGymPlan) {
    if (editing) {
      updatePlan.mutate(
        { id: editing.id, input: values },
        {
          onSuccess: () => {
            toast.success(`${values.name} updated`)
            setSheetOpen(false)
          },
          onError: (error) => toast.error(error.message),
        }
      )
    } else {
      createPlan.mutate(values, {
        onSuccess: () => {
          toast.success(`${values.name} created`)
          setSheetOpen(false)
        },
        onError: (error) => toast.error(error.message),
      })
    }
  }

  function handleDelete() {
    if (!deleting) return
    const name = deleting.name
    deletePlan.mutate(deleting.id, {
      onSuccess: () => toast.success(`${name} deleted`),
      onError: (error) => toast.error(error.message),
    })
    setDeleting(null)
  }

  const columns = useMemo(
    () =>
      createGymPlanColumns({
        onEdit: handleEdit,
        onDelete: setDeleting,
      }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full min-w-0 lg:w-auto">
          <FilterPills
            options={categoryOptions}
            value={activeCategoryLabel}
            onChange={(value) => {
              const category =
                value === "All"
                  ? null
                  : (categories.data?.data.find((c) => c.name === value) ?? null)
              setFilters({ categoryId: category?.id ?? null, page: 1 })
            }}
          />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              placeholder="Search plans..."
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
                <DropdownMenuRadioGroup
                  value={filters.status ?? "all"}
                  onValueChange={(value) =>
                    setFilters({
                      status: value === "all" ? null : (value as "active" | "inactive"),
                      page: 1,
                    })
                  }
                >
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filters.sort}
                  onValueChange={(value) =>
                    setFilters({ sort: value as "asc" | "desc", page: 1 })
                  }
                >
                  <DropdownMenuLabel>Sort by name</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="asc">A to Z</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">Z to A</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAdd} className="flex-1 sm:flex-none">
              <Plus className="size-4" />
              Add Plan
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
          emptyMessage="No plans found."
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

      <PlanFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        plan={editing}
        pending={createPlan.isPending || updatePlan.isPending}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete plan?"
        description={
          deleting
            ? `"${deleting.name}" will be removed. Members already on this plan keep their access until it ends.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
