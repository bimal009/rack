"use client"

import {
  useCreateTaxRate,
  useDeleteTaxRate,
  useTaxRatesQuery,
  useUpdateTaxRate,
} from "../hooks/use-tax-rates"
import { SimpleTypeList } from "./simple-type-list"

export function TaxRatesList() {
  return (
    <SimpleTypeList
      label="Tax Rate"
      icon="Percent"
      hasRate
      useList={useTaxRatesQuery}
      useCreate={useCreateTaxRate}
      useUpdate={useUpdateTaxRate}
      useDelete={useDeleteTaxRate}
    />
  )
}
