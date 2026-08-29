"use client"

import type { Brand, NewBrand } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useBrandsQuery,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from "../hooks/use-brands"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<Brand>()
  return columnHelper.columns([columnHelper.accessor("name", { header: "Name" })])
}

export function BrandsList() {
  return (
    <TypeList<Brand, NewBrand>
      label="Brand"
      buildColumns={buildColumns}
      useList={useBrandsQuery}
      useCreate={useCreateBrand}
      useUpdate={useUpdateBrand}
      useDelete={useDeleteBrand}
      renderForm={(props) => (
        <TypeFormSheet
          label="Brand"
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
