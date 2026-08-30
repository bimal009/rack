"use client"

import type { NewPayRate, PayRate } from "@repo/types"

import { Badge } from "@repo/ui/components/ui/badge"
import {
  createDataTableColumnHelper,
  type DataTableColumnDef,
} from "@repo/ui/components/ui/data-table"

import { TypeList } from "@/features/tenant/settings/types/components/type-list"

import {
  useCreatePayRate,
  useDeletePayRate,
  usePayRatesQuery,
  useUpdatePayRate,
} from "../hooks/use-pay-rates"
import { PayRateFormSheet } from "./pay-rate-form-sheet"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function earnings(row: PayRate) {
  const parts: string[] = []
  if (row.perClassRate) parts.push(`${currency.format(row.perClassRate)}/class`)
  if (row.perPersonRate) parts.push(`${currency.format(row.perPersonRate)}/person`)
  if (row.perSessionRate)
    parts.push(`${currency.format(row.perSessionRate)}/session`)
  if (row.revenueSharePercent)
    parts.push(`${row.revenueSharePercent}% revenue`)
  return parts.length > 0 ? parts.join(" + ") : "—"
}

function buildColumns(): DataTableColumnDef<PayRate>[] {
  const columnHelper = createDataTableColumnHelper<PayRate>()
  return columnHelper.columns([
    columnHelper.accessor("name", { header: "Policy" }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: ({ getValue }) => (
        <Badge
          variant="outline"
          className="rounded-full font-normal capitalize"
        >
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor((row) => earnings(row), {
      id: "earnings",
      header: "Earnings",
    }),
    columnHelper.accessor("compensateUnpaidBookings", {
      header: "Unpaid bookings",
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() ? "default" : "secondary"}
          className="rounded-full"
        >
          {getValue() ? "Compensated" : "Not compensated"}
        </Badge>
      ),
    }),
  ])
}

export function PayRatesList() {
  return (
    <TypeList<PayRate, NewPayRate>
      label="Pay rate"
      buildColumns={buildColumns}
      useList={usePayRatesQuery}
      useCreate={useCreatePayRate}
      useUpdate={useUpdatePayRate}
      useDelete={useDeletePayRate}
      renderForm={(props) => (
        <PayRateFormSheet
          open={props.open}
          onOpenChange={props.onOpenChange}
          policy={props.item}
          pending={props.pending}
          onSubmit={props.onSubmit}
        />
      )}
    />
  )
}
