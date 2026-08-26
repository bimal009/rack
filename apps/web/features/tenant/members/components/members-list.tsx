"use client"

import { useState } from "react"
import { LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"
import { cn } from "@repo/ui/lib/utils"

import { memberColumns, type Member } from "./columns"

const members: Member[] = [
  { name: "Savannah Nguyen", email: "savannah@234.com", plan: "Annual Plan", joined: "1 Feb 26", status: "Active" },
  { name: "Kathryn Murphy", email: "kathryn@114.com", plan: "Monthly Plan", joined: "2 Feb 26", status: "On Hold" },
  { name: "Courtney Henry", email: "henry@courtney.com", plan: "Quarterly Plan", joined: "15 Feb 26", status: "Active" },
  { name: "Kristin Watson", email: "kristin@gmail.com", plan: "Annual Plan", joined: "15 Feb 26", status: "Active" },
  { name: "Theresa Webb", email: "webb@gmail.com", plan: "Monthly Plan", joined: "23 Feb 26", status: "Expired" },
  { name: "Brooklyn Simmons", email: "brooklyn@moms.com", plan: "Annual Plan", joined: "25 Feb 26", status: "Active" },
  { name: "Ralph Edwards", email: "ralph@edwards.com", plan: "Quarterly Plan", joined: "25 Feb 26", status: "Expired" },
  { name: "Wade Warren", email: "naguyen@warren.com", plan: "Monthly Plan", joined: "16 Mar 26", status: "On Hold" },
  { name: "Eleanor Pena", email: "eleanor@warren.com", plan: "Annual Plan", joined: "16 Mar 26", status: "Active" },
  { name: "Marvin McKinney", email: "marvin@warren.com", plan: "Monthly Plan", joined: "20 Mar 26", status: "Active" },
  { name: "Ronald Richards", email: "ronald@warren.com", plan: "Quarterly Plan", joined: "20 Mar 26", status: "Expired" },
]

const filters = ["All", "Active", "On Hold", "Expired"] as const

export function MembersList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")

  const visible =
    filter === "All" ? members : members.filter((m) => m.status === filter)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 w-fit">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

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
