"use client"

import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react"
import type { StaffWithUser } from "@repo/types"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import {
  createDataTableColumnHelper,
  createIndexColumn,
} from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { cn } from "@repo/ui/lib/utils"

import { gymRoleLabel } from "../lib/roles"

const joinedFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "2-digit",
})

const payCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
})

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

function payLabel(row: StaffWithUser) {
  if (row.payRate == null || !row.payType) return null
  const suffix =
    row.payType === "Hourly"
      ? "/hr"
      : row.payType === "Per Class"
        ? "/class"
        : "/mo"
  return `${payCurrency.format(row.payRate)}${suffix}`
}

interface StaffColumnOptions {
  instructor?: boolean
  instructorTypeName?: (id: string | null) => string
  onEdit?: (row: StaffWithUser) => void
  onDelete?: (row: StaffWithUser) => void
}

export function createStaffDirectoryColumns({
  instructor = false,
  instructorTypeName,
  onEdit,
  onDelete,
}: StaffColumnOptions = {}) {
  const columnHelper = createDataTableColumnHelper<StaffWithUser>()

  const hasActions = Boolean(onEdit || onDelete)

  const actionsColumn = columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
            <PenSquare />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete?.(row.original)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  })

  const nameColumn = columnHelper.accessor(
    (row) => `${row.user.name} ${row.user.email}`,
    {
      id: "staff",
      header: instructor ? "Instructor" : "Staff",
      cell: ({ row }) => {
        const { name, email, image } = row.original.user
        return (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarImage src={image ?? undefined} alt="" />
              <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                {initialsFromName(name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {name}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        )
      },
    }
  )

  const payColumn = columnHelper.accessor("payRate", {
    header: "Pay Rate",
    cell: ({ row }) => {
      const label = payLabel(row.original)
      return label ? (
        <span className="text-foreground">{label}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  })

  const joinedColumn = columnHelper.accessor("createdAt", {
    header: "Joined",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {joinedFormatter.format(new Date(getValue()))}
      </span>
    ),
  })

  const statusColumn = columnHelper.accessor("isActive", {
    header: "Status",
    cell: ({ getValue }) => {
      const active = getValue()
      return (
        <Badge
          variant={active ? "default" : "secondary"}
          className={cn("rounded-full", !active && "bg-muted text-foreground")}
        >
          {active ? "Active" : "Inactive"}
        </Badge>
      )
    },
  })

  if (instructor) {
    return columnHelper.columns([
      createIndexColumn(columnHelper),
      nameColumn,
      columnHelper.accessor("instructorTypeId", {
        header: "Type",
        cell: ({ getValue }) => {
          const label = instructorTypeName?.(getValue()) ?? ""
          return label ? (
            <Badge variant="outline" className="rounded-full font-normal">
              {label}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      }),
      columnHelper.accessor("experience", {
        header: "Experience",
        cell: ({ getValue }) => {
          const years = getValue()
          return years == null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <span>
              {years} {years === 1 ? "yr" : "yrs"}
            </span>
          )
        },
      }),
      payColumn,
      columnHelper.accessor("canBeBooked", {
        header: "Bookable",
        cell: ({ getValue }) => (
          <Badge
            variant={getValue() ? "default" : "secondary"}
            className="rounded-full"
          >
            {getValue() ? "Yes" : "No"}
          </Badge>
        ),
      }),
      columnHelper.accessor("visibility", {
        header: "Visibility",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue()}</span>
        ),
      }),
      joinedColumn,
      statusColumn,
      ...(hasActions ? [actionsColumn] : []),
    ])
  }

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    nameColumn,
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-full font-normal">
          {gymRoleLabel(getValue())}
        </Badge>
      ),
    }),
    payColumn,
    joinedColumn,
    statusColumn,
    ...(hasActions ? [actionsColumn] : []),
  ])
}
