"use client"

import { useMemo, useState } from "react"
import { Download, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { initialMembers } from "../lib/data"
import type { Member, MemberInput } from "../lib/schema"
import { createMemberColumns, fullName } from "./columns"
import { MemberFormSheet } from "./member-form-sheet"

const filters = ["All", "Active", "On Hold", "Expired"] as const

function generateId() {
  return `mem_${Math.random().toString(36).slice(2, 10)}`
}

function today() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const date = new Date()
  return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`
}

export function MembersList() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [view, setView] = useState<"list" | "grid">("list")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)

  const visible =
    filter === "All" ? members : members.filter((m) => m.status === filter)

  function handleAdd() {
    setEditingMember(null)
    setSheetOpen(true)
  }

  function handleEdit(member: Member) {
    setEditingMember(member)
    setSheetOpen(true)
  }

  function handleSubmit(values: MemberInput, avatarUrl?: string) {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id
            ? { ...member, ...values, avatarUrl }
            : member
        )
      )
      toast.success(`${fullName(values)} updated`)
    } else {
      setMembers((prev) => [
        {
          ...values,
          id: generateId(),
          avatarUrl,
          joined: today(),
          status: "Active",
        },
        ...prev,
      ])
      toast.success(`${fullName(values)} added`)
    }
  }

  function handleDelete() {
    if (!deletingMember) return
    setMembers((prev) =>
      prev.filter((member) => member.id !== deletingMember.id)
    )
    toast.success(`${fullName(deletingMember)} removed`)
    setDeletingMember(null)
  }

  function handleExport() {
    exportToCsv(
      "members.csv",
      visible.map((member) => ({
        Name: fullName(member),
        Email: member.email,
        Phone: member.phone,
        Plan: member.memberships.map((m) => m.planName).join("; "),
        Joined: member.joined,
        Status: member.status,
      }))
    )
  }

  const columns = useMemo(
    () =>
      createMemberColumns({
        onEdit: handleEdit,
        onDelete: setDeletingMember,
      }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <FilterPills options={filters} value={filter} onChange={setFilter} />
        <Button variant="outline" onClick={handleExport}>
          <Download className="size-4" />
          Export
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={visible}
        getRowId={(row) => row.id}
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
            <Button onClick={handleAdd}>
              <Plus className="size-4" />
              Add Member
            </Button>
          </>
        }
      />

      <MemberFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        member={editingMember}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingMember)}
        onOpenChange={(open) => !open && setDeletingMember(null)}
        title="Remove member?"
        description={
          deletingMember
            ? `"${fullName(deletingMember)}" will be removed from your member list.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
