"use client"

import type { AreaType, NewAreaType } from "@repo/types"

import { Badge } from "@repo/ui/components/ui/badge"
import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useAreaTypesQuery,
  useCreateAreaType,
  useDeleteAreaType,
  useUpdateAreaType,
} from "../hooks/use-area-types"
import { AreaTypeFormSheet } from "./area-type-form-sheet"
import { TypeList } from "./type-list"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<AreaType>()
  return columnHelper.columns([
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("availableForBooking", {
      header: "Bookable",
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() ? "default" : "secondary"}
          className="rounded-full"
        >
          {getValue() ? "Yes" : "No"}
        </Badge>
      ),
    }),
    columnHelper.accessor("pricePerHour", {
      header: "Price / hour",
      cell: ({ getValue }) => currency.format(getValue()),
    }),
    columnHelper.accessor("maxPlayers", { header: "Max Players" }),
  ])
}

export function AreaTypesList() {
  return (
    <TypeList<AreaType, NewAreaType>
      label="Area Type"
      buildColumns={buildColumns}
      useList={useAreaTypesQuery}
      useCreate={useCreateAreaType}
      useUpdate={useUpdateAreaType}
      useDelete={useDeleteAreaType}
      renderForm={(props) => (
        <AreaTypeFormSheet
          open={props.open}
          onOpenChange={props.onOpenChange}
          area={props.item}
          pending={props.pending}
          onSubmit={props.onSubmit}
        />
      )}
    />
  )
}
