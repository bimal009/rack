"use client"

import type { NewPlanCategory, PlanCategory } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCreatePlanCategory,
  useDeletePlanCategory,
  usePlanCategoriesQuery,
  useUpdatePlanCategory,
} from "../hooks/use-plan-categories"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<PlanCategory>()
  return columnHelper.columns([columnHelper.accessor("name", { header: "Name" })])
}

export function PlanCategoriesList() {
  return (
    <TypeList<PlanCategory, NewPlanCategory>
      label="Plan category"
      buildColumns={buildColumns}
      useList={usePlanCategoriesQuery}
      useCreate={useCreatePlanCategory}
      useUpdate={useUpdatePlanCategory}
      useDelete={useDeletePlanCategory}
      renderForm={(props) => (
        <TypeFormSheet
          label="Plan category"
          open={props.open}
          onOpenChange={props.onOpenChange}
          item={props.item}
          pending={props.pending}
          onSubmit={props.onSubmit}
        />
      )}
    />
  )
}
