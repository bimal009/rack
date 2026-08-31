"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Download, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { DataTable } from "@repo/ui/components/ui/data-table"

import { DeleteConfirmDialog } from "@/features/tenant/components/delete-confirm-dialog"
import { FilterPills } from "@/features/tenant/components/filter-pills"
import { exportToCsv } from "@/features/tenant/lib/export-csv"
import { useAreaTypesQuery } from "@/features/tenant/settings/types/hooks/use-area-types"

import { generateAreaId, initialAreas } from "../lib/data"
import type { Area, AreaInput } from "../lib/schema"
import { AreaFormSheet } from "./area-form-sheet"
import { createAreaColumns } from "./columns"

const filters = ["All", "Active", "Inactive"] as const

export function AreasList() {
  const tenant = useParams<{ tenant: string }>().tenant
  const areaTypesQuery = useAreaTypesQuery(tenant, { limit: 100 })
  const areaTypeName = useMemo(() => {
    const map = new Map(
      (areaTypesQuery.data?.data ?? []).map((type) => [type.id, type.name])
    )
    return (id: string) => map.get(id) ?? ""
  }, [areaTypesQuery.data])

  const [areas, setAreas] = useState<Area[]>(initialAreas)
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [deletingArea, setDeletingArea] = useState<Area | null>(null)

  const visible =
    filter === "All"
      ? areas
      : areas.filter((area) => area.status === filter)

  function handleAdd() {
    setEditingArea(null)
    setSheetOpen(true)
  }

  function handleEdit(area: Area) {
    setEditingArea(area)
    setSheetOpen(true)
  }

  function handleSubmit(values: AreaInput) {
    if (editingArea) {
      setAreas((prev) =>
        prev.map((area) =>
          area.id === editingArea.id ? { ...area, ...values } : area
        )
      )
      toast.success(`${values.name} updated`)
    } else {
      setAreas((prev) => [{ ...values, id: generateAreaId() }, ...prev])
      toast.success(`${values.name} created`)
    }
  }

  function handleDelete() {
    if (!deletingArea) return
    setAreas((prev) => prev.filter((area) => area.id !== deletingArea.id))
    toast.success(`${deletingArea.name} deleted`)
    setDeletingArea(null)
  }

  function handleExport() {
    exportToCsv(
      "areas.csv",
      visible.map((area) => ({
        Name: area.name,
        Type: area.areaTypeId ? areaTypeName(area.areaTypeId) : "",
        "Price / hour": area.pricePerHour,
        Visibility: area.visibility,
        Status: area.status,
      }))
    )
  }

  const columns = useMemo(
    () =>
      createAreaColumns({
        onEdit: handleEdit,
        onDelete: setDeletingArea,
        areaTypeName,
      }),
    [areaTypeName]
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
