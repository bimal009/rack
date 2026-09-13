"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { Input } from "@repo/ui/components/ui/input"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { useDebounce } from "@/hooks/use-debounce"
import { createGymMembershipColumns } from "./columns"
import { useMembershipsQuery } from "../hook/useMembership"


const STATUS_OPTIONS = ["All", "Active", "Paused", "Expired", "Cancelled"] as const
type StatusOption = (typeof STATUS_OPTIONS)[number]

export default function GymMembershipList() {
  const tenant = useParams<{ id: string }>().id
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusOption>("All")
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 350)

  const query = useMembershipsQuery(tenant, {
    page,
    search: debouncedSearch || undefined,
    status: status === "All" ? undefined : status,
  })

  const rows = query.data?.data ?? []
  const meta = query.data?.meta

  const columns = useMemo(() => createGymMembershipColumns(), [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full min-w-0 lg:w-auto">
          <FilterPills
            options={[...STATUS_OPTIONS]}
            value={status}
            onChange={(value) => {
              setStatus(value as StatusOption)
              setPage(1)
            }}
          />
        </div>

        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search members..."
            className="rounded-full pl-9 shadow-none"
          />
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
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={meta.page >= meta.totalPages || query.isPlaceholderData}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}