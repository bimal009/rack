"use client"

import { Eye, Pencil, RotateCw } from "lucide-react"
import type { GymMembershipWithMemberAndPlan } from "@repo/types"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  createDataTableColumnHelper,
  createIndexColumn,
} from "@repo/ui/components/ui/data-table"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

const STATUS_VARIANT: Record<
  GymMembershipWithMemberAndPlan["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  Active: "default",
  Paused: "secondary",
  Expired: "outline",
  Cancelled: "destructive",
}

interface GymMembershipColumnActions {
  onView: (membership: GymMembershipWithMemberAndPlan) => void
  onEdit: (membership: GymMembershipWithMemberAndPlan) => void
  onExtend: (membership: GymMembershipWithMemberAndPlan) => void
}

export function createGymMembershipColumns({ onView, onEdit, onExtend }: GymMembershipColumnActions) {
  const columnHelper = createDataTableColumnHelper<GymMembershipWithMemberAndPlan>()

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    columnHelper.accessor("member", {
      header: "Member",
      cell: ({ getValue }) => {
        const member = getValue()
        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {member.user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
          </div>
        )
      },
    }),
    columnHelper.accessor("plan", {
      header: "Plan",
      enableGlobalFilter: false,
      cell: ({ getValue }) => {
        const plan = getValue()
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-foreground">{plan.name}</span>
            {plan.category ? (
              <Badge variant="outline" className="w-fit rounded-full font-normal">
                {plan.category.name}
              </Badge>
            ) : null}
          </div>
        )
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge variant={STATUS_VARIANT[status]} className="rounded-full">
            {status}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("price", {
      header: "Price",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="font-medium text-foreground">{currency.format(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onView(row.original)}
          >
            <Eye className="size-4" />
            <span className="sr-only">View membership</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit membership</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onExtend(row.original)}
          >
            <RotateCw className="size-4" />
            <span className="sr-only">Extend membership</span>
          </Button>
        </div>
      ),
    }),
  ])
}
