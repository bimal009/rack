"use client"

import { MoreHorizontal, PenSquare, QrCode, Trash2 } from "lucide-react"
import type { MemberStatus, MemberWithUser } from "@repo/types"

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

export const statusVariant: Record<
  MemberStatus,
  "default" | "secondary" | "destructive"
> = {
  Active: "default",
  "On Hold": "secondary",
  Expired: "destructive",
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

interface MemberColumnActions {
  onEdit: (member: MemberWithUser) => void
  onDelete: (member: MemberWithUser) => void
  onShowQr: (member: MemberWithUser) => void
}

export function createMemberColumns({
  onEdit,
  onDelete,
  onShowQr,
}: MemberColumnActions) {
  const columnHelper = createDataTableColumnHelper<MemberWithUser>()

  return columnHelper.columns([
    createIndexColumn(columnHelper),
    columnHelper.accessor((row) => `${row.user.name} ${row.user.email}`, {
      id: "member",
      header: "Member",
      cell: ({ row }) => {
        const { name, email, image } = row.original.user
        return (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarImage src={image ?? undefined} alt="" />
              <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue() ?? "—"}</span>
      ),
    }),
    columnHelper.accessor("joinedAt", {
      header: "Join Date",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue()).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "2-digit",
          })}
        </span>
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
