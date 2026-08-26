"use client"

import { MoreHorizontal, PenSquare, QrCode, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Badge } from "@repo/ui/components/ui/badge"
import {
  createDataTableColumnHelper,
  createIndexColumn,
  createSelectionColumn,
} from "@repo/ui/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { cn } from "@repo/ui/lib/utils"

import type { Member, MemberStatus } from "../lib/schema"

export const statusVariant: Record<
  MemberStatus,
  "default" | "secondary" | "destructive"
> = {
  Active: "default",
  "On Hold": "secondary",
  Expired: "destructive",
}

export function fullName(member: Pick<Member, "firstName" | "lastName">) {
  return `${member.firstName} ${member.lastName}`.trim()
}

export function initials(member: Pick<Member, "firstName" | "lastName">) {
  return (
    (member.firstName[0] ?? "") + (member.lastName[0] ?? "")
  ).toUpperCase()
}

interface MemberColumnActions {
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  onShowQr: (member: Member) => void
}

export function createMemberColumns({
  onEdit,
  onDelete,
  onShowQr,
}: MemberColumnActions) {
  const columnHelper = createDataTableColumnHelper<Member>()

  return columnHelper.columns([
    createSelectionColumn(columnHelper),
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${fullName(row)} ${row.email}`, {
      id: "member",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarImage src={row.original.avatarUrl} alt="" />
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials(row.original)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {fullName(row.original)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.memberships.length, {
      id: "plan",
      header: "Plan",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const memberships = row.original.memberships
        if (memberships.length === 0) {
          return (
            <Badge variant="secondary" className="rounded-full font-normal">
              No plan
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="rounded-full font-normal">
            {memberships[0]!.planName}
            {memberships.length > 1 ? ` +${memberships.length - 1}` : ""}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("joined", {
      header: "Join Date",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge
            variant={statusVariant[status]}
            className={cn(
              "rounded-full",
              status === "On Hold" && "bg-muted text-foreground"
            )}
          >
            {status}
          </Badge>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PenSquare />
              Edit Member
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShowQr(row.original)}>
              <QrCode />
              Show QR Code
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 />
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
