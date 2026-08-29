"use client"

import {
  useCreateTaxRate,
  useDeleteTaxRate,
  useTaxRatesQuery,
  useUpdateTaxRate,
} from "../hooks/use-tax-rates"
import { TypeList } from "./type-list"

export function TaxRatesList() {
  return (
    <TypeList
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
