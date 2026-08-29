"use client"

import type { ClassType, NewClassType } from "@repo/types"

import { Badge } from "@repo/ui/components/ui/badge"
import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useClassTypesQuery,
  useCreateClassType,
  useDeleteClassType,
  useUpdateClassType,
} from "../hooks/use-class-types"
import { ClassTypeFormSheet } from "./class-type-form-sheet"
import { TypeList } from "./type-list"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<ClassType>()
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
    columnHelper.accessor("pricePerClass", {
      header: "Price / class",
      cell: ({ getValue }) => currency.format(getValue()),
    }),
    columnHelper.accessor("maxParticipants", { header: "Max Participants" }),
  ])
}

export function ClassTypesList() {
  return (
    <TypeList<ClassType, NewClassType>
      label="Class Type"
      buildColumns={buildColumns}
      useList={useClassTypesQuery}
      useCreate={useCreateClassType}
      useUpdate={useUpdateClassType}
      useDelete={useDeleteClassType}
      renderForm={(props) => (
        <ClassTypeFormSheet
          open={props.open}
          onOpenChange={props.onOpenChange}
          type={props.item}
          pending={props.pending}
          onSubmit={props.onSubmit}
        />
      )}
    />
  )
}
