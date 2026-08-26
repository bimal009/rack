"use client"

import { useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"

import { initialMembers } from "../lib/data"
import { memberColumns } from "./columns"

const filters = ["All", "Active", "On Hold", "Expired"] as const

export function MembersList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")

  const visible =
    filter === "All"
      ? initialMembers
      : initialMembers.filter((m) => m.status === filter)

  return (
    <div className="flex flex-col gap-4">
      <FilterPills options={filters} value={filter} onChange={setFilter} />

      <DataTable
        columns={memberColumns}
        data={visible}
        getRowId={(row) => row.email}
        enableRowSelection
        searchPlaceholder="Search by name or email..."
        toolbar={
          <>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="size-4" />
            </Button>
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setView("list")}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>
            <Button>
              <Plus className="size-4" />
              Add Member
            </Button>
          </>
        }
      />
    </div>
  )
}
