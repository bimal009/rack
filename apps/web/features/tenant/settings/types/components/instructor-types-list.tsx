"use client"

import type { InstructorTypeRecord, NewInstructorType } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCreateInstructorType,
  useDeleteInstructorType,
  useInstructorTypesQuery,
  useUpdateInstructorType,
} from "../hooks/use-instructor-types"
import { InstructorTypeFormSheet } from "./instructor-type-form-sheet"
import { TypeList } from "./type-list"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<InstructorTypeRecord>()
  return columnHelper.columns([
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("maxConcurrentBookings", {
      header: "Max Concurrent Bookings",
    }),
  ])
}

export function InstructorTypesList() {
  return (
    <TypeList<InstructorTypeRecord, NewInstructorType>
      label="Instructor Type"
      buildColumns={buildColumns}
      useList={useInstructorTypesQuery}
      useCreate={useCreateInstructorType}
      useUpdate={useUpdateInstructorType}
      useDelete={useDeleteInstructorType}
      renderForm={(props) => (
        <InstructorTypeFormSheet
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
