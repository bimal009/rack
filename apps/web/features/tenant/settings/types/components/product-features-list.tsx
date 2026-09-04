"use client"

import type { NewProductFeature, ProductFeature } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCreateProductFeature,
  useDeleteProductFeature,
  useProductFeaturesQuery,
  useUpdateProductFeature,
} from "../hooks/use-product-features"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<ProductFeature>()
  return columnHelper.columns([columnHelper.accessor("name", { header: "Name" })])
}

export function ProductFeaturesList() {
  return (
    <TypeList<ProductFeature, NewProductFeature>
      label="Product feature"
      buildColumns={buildColumns}
      useList={useProductFeaturesQuery}
      useCreate={useCreateProductFeature}
      useUpdate={useUpdateProductFeature}
      useDelete={useDeleteProductFeature}
      renderForm={(props) => (
        <TypeFormSheet
          label="Product feature"
          namePlaceholder="Vegan, Best Seller, New Arrival"
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
