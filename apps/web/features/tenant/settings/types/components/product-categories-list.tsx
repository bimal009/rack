"use client"

import type { NewProductCategory, ProductCategory } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCreateProductCategory,
  useDeleteProductCategory,
  useProductCategoriesQuery,
  useUpdateProductCategory,
} from "../hooks/use-product-categories"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<ProductCategory>()
  return columnHelper.columns([columnHelper.accessor("name", { header: "Name" })])
}

export function ProductCategoriesList() {
  return (
    <TypeList<ProductCategory, NewProductCategory>
      label="Product category"
      buildColumns={buildColumns}
      useList={useProductCategoriesQuery}
      useCreate={useCreateProductCategory}
      useUpdate={useUpdateProductCategory}
      useDelete={useDeleteProductCategory}
      renderForm={(props) => (
        <TypeFormSheet
          label="Product category"
          namePlaceholder="Apparel, Supplements, Accessories"
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
