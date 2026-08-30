"use client"

import type { NewTaxRate, TaxRate } from "@repo/types"

import { createDataTableColumnHelper } from "@repo/ui/components/ui/data-table"

import {
  useCreateTaxRate,
  useDeleteTaxRate,
  useTaxRatesQuery,
  useUpdateTaxRate,
} from "../hooks/use-tax-rates"
import { TypeList } from "./type-list"
import { TypeFormSheet } from "./type-form-sheet"

function buildColumns() {
  const columnHelper = createDataTableColumnHelper<TaxRate>()
  return columnHelper.columns([
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("rate", {
      header: "Rate",
      cell: ({ getValue }) => `${getValue()}%`,
    }),
  ])
}

export function TaxRatesList() {
  return (
    <TypeList<TaxRate, NewTaxRate>
      label="Tax Rate"
      buildColumns={buildColumns}
      useList={useTaxRatesQuery}
      useCreate={useCreateTaxRate}
      useUpdate={useUpdateTaxRate}
      useDelete={useDeleteTaxRate}
      renderForm={(props) => (
        <TypeFormSheet
          label="Tax Rate"
          namePlaceholder="VAT, Service Charge"
          hasRate
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
