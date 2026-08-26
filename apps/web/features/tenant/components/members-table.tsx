"use client"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { recentMemberColumns, type RecentMember } from "./members-columns"

const members: RecentMember[] = [
  { name: "Priya Natarajan", plan: "Annual Plan", status: "Active", joined: "24 Aug 26" },
  { name: "Honorato Imogene Curry", plan: "Annual Plan", status: "Active", joined: "22 Aug 26" },
  { name: "Maisha Lucy Zamora Gon", plan: "Quarterly Plan", status: "Active", joined: "20 Aug 26" },
  { name: "Thomas Goodman", plan: "Monthly Plan", status: "On Hold", joined: "18 Aug 26" },
  { name: "Jonathan Ibrahim Sheikh", plan: "Monthly Plan", status: "Expired", joined: "15 Aug 26" },
]

export function MembersTable() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Recent Members
          </h2>
          <p className="text-xs text-muted-foreground">Latest sign-ups</p>
        </div>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          View All
        </Button>
      </div>

      <div className="mt-4 flex-1">
        <DataTable
          columns={recentMemberColumns}
          data={members}
          getRowId={(row) => row.name}
          enableSearch={false}
          enablePagination={false}
        />
      </div>
    </div>
  )
}
