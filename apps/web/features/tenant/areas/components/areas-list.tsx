"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import type { Area, NewArea } from "@repo/types"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"

import {
  useAreasQuery,
  useCreateArea,
  useDeleteArea,
  useUpdateArea,
} from "../hooks/use-areas"
import { AreaFormSheet } from "./area-form-sheet"
import { createAreaColumns } from "./columns"

const filters = ["All", "Active", "Inactive"] as const

export function AreasList() {
  const tenant = useParams<{ tenant: string }>().tenant

  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [deletingArea, setDeletingArea] = useState<Area | null>(null)

  const areasQuery = useAreasQuery(tenant, {
    limit: 100,
    status: filter === "All" ? undefined : filter,
  })
  const createArea = useCreateArea(tenant)
  const updateArea = useUpdateArea(tenant)
  const deleteArea = useDeleteArea(tenant)

  const rows = areasQuery.data?.data ?? []

  function handleAdd() {
    setEditingArea(null)
    setSheetOpen(true)
  }

  function handleEdit(area: Area) {
    setEditingArea(area)
    setSheetOpen(true)
  }

  function handleSubmit(values: NewArea) {
    if (editingArea) {
      updateArea.mutate(
        { id: editingArea.id, input: values },
        {
          onSuccess: () => {
            toast.success(`${values.name} updated`)
            setSheetOpen(false)
          },
          onError: (error) => toast.error(error.message),
        }
      )
    } else {
      createArea.mutate(values, {
        onSuccess: () => {
          toast.success(`${values.name} created`)
          setSheetOpen(false)
        },
        onError: (error) => toast.error(error.message),
      })
    }
  }

  function handleDelete() {
    if (!deletingArea) return
    const name = deletingArea.name
    deleteArea.mutate(deletingArea.id, {
      onSuccess: () => toast.success(`${name} deleted`),
      onError: (error) => toast.error(error.message),
    })
    setDeletingArea(null)
  }

  const columns = useMemo(
    () =>
      createAreaColumns({
        onEdit: handleEdit,
        onDelete: setDeletingArea,
      }),
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <FilterPills options={filters} value={filter} onChange={setFilter} />

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableRowSelection
        isLoading={areasQuery.isPending}
        searchPlaceholder="Search areas..."
        emptyMessage="No areas found."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Add Area
          </Button>
        }
      />

      <AreaFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        area={editingArea}
        pending={createArea.isPending || updateArea.isPending}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingArea)}
        onOpenChange={(open) => !open && setDeletingArea(null)}
        title="Delete area?"
        description={
          deletingArea
            ? `"${deletingArea.name}" will be removed and can no longer be booked.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
