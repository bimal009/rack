"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, ListFilter, Plus, SearchIcon } from "lucide-react"
import { toast } from "sonner"
import type { GymMembershipListQuery } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { Input } from "@repo/ui/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { useMembershipCategoriesQuery } from "@/features/tenant/settings/types/hooks/use-membership-categories"
import { useDebounce } from "@/hooks/use-debounce"
import { createGymMembershipColumns } from "./columns"
import { GymMembershipFormSheet } from "./gymMembership-form"
import { useMembershipFilters } from "../hook/use-membership-filters"
import { useCreateMembership, useMembershipsQuery } from "../hook/useMembership"


const STATUS_OPTIONS = ["all", "Active", "Paused", "Expired", "Cancelled"] as const

export default function GymMembershipList() {
  const tenant = useParams<{ id: string }>().id
  const [filters, setFilters] = useMembershipFilters()
  const [formOpen, setFormOpen] = useState(false)
  const createMembership = useCreateMembership(tenant)

  const debouncedSearch = useDebounce(filters.search, 350)
  const categories = useMembershipCategoriesQuery(tenant, { limit: 100 })

  const categoryOptions = ["All", ...(categories.data?.data.map((category) => category.name) ?? [])]
  const activeCategoryLabel = filters.categoryId
    ? (categories.data?.data.find((category) => category.id === filters.categoryId)?.name ?? "All")
    : "All"

  const queryParams: Partial<GymMembershipListQuery> = {
    page: filters.page,
    search: debouncedSearch || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    planCategoryId: filters.categoryId ?? undefined,
    sortOrder: filters.sort,
  }
  const query = useMembershipsQuery(tenant, queryParams)

  const rows = query.data?.data ?? []
  const meta = query.data?.meta

  const columns = useMemo(() => createGymMembershipColumns(), [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full min-w-0 lg:w-auto">
          <FilterPills
            options={categoryOptions}
            value={activeCategoryLabel}
            onChange={(value) => {
              const category = categories.data?.data.find((item) => item.name === value)
              setFilters({ categoryId: value === "All" ? null : (category?.id ?? null), page: 1 })
            }}
          />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              placeholder="Search members..."
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
                  value={filters.status}
                  onValueChange={(value) => setFilters({ status: value as typeof filters.status, page: 1 })}
                >
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {option === "all" ? "All" : option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filters.sort}
                  onValueChange={(value) => setFilters({ sort: value as "asc" | "desc", page: 1 })}
                >
                  <DropdownMenuLabel>Sort by start date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="desc">Newest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">Oldest first</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="button"
              className="flex-1 sm:flex-none"
              onClick={() => setFormOpen(true)}
            >
              <Plus className="size-4" />
              Add Membership
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
          emptyMessage="No memberships found."
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

      <GymMembershipFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        pending={createMembership.isPending}
        onSubmit={(memberId, values) =>
          createMembership.mutate(
            { memberId, input: values },
            {
              onSuccess: () => {
                toast.success("Membership added")
                setFormOpen(false)
              },
              onError: (error) => toast.error(error.message),
            }
          )
        }
      />

    </div>
  )
}