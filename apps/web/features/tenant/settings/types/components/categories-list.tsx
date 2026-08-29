"use client"

import type { NewProductCategory, ProductCategory } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/use-categories"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<ProductCategory>()
  return columnHelper.columns([columnHelper.accessor("name", { header: "Name" })])
}

export function CategoriesList() {
  return (
    <TypeList<ProductCategory, NewProductCategory>
      label="Category"
      buildColumns={buildColumns}
      useList={useCategoriesQuery}
      useCreate={useCreateCategory}
      useUpdate={useUpdateCategory}
      useDelete={useDeleteCategory}
      renderForm={(props) => (
        <TypeFormSheet
          label="Category"
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
