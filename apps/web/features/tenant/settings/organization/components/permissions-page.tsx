"use client"

import { useMemo, useState } from "react"
import { Info, Search } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select"
import { cn } from "@repo/ui/lib/utils"

import {
  accessLevels,
  defaultPermissions,
  isDefaultRole,
  permissionCategories,
  roleNames,
  type AccessLevel,
  type PermissionMatrix,
  type RoleName,
} from "../lib/permissions-data"

export function PermissionsPage() {
  const [matrix, setMatrix] = useState<PermissionMatrix>(defaultPermissions)
  const [selectedRole, setSelectedRole] = useState<RoleName>("Admin")
  const [search, setSearch] = useState("")

  const isAdmin = selectedRole === "Admin"

  function updateAccess(category: string, level: AccessLevel) {
    setMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [category]: level,
      },
    }))
  }

  const visibleCategories = useMemo(
    () =>
      permissionCategories.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Configure what each role can do.
      </p>

      <div className="flex items-start gap-2.5 rounded-lg bg-primary/5 px-3.5 py-2.5 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Changes apply the next time affected users sign in (within ~15
          minutes).
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Roles
          </p>
          <div className="flex flex-col gap-0.5">
            {roleNames.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                  selectedRole === role
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {role}
                {isDefaultRole(role) && (
                  <Badge variant="outline" className="rounded-full font-normal">
                    Default
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            {selectedRole}
          </h2>

          {isAdmin && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-muted px-3.5 py-2.5 text-sm text-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p>
                Administrators have full access to everything. This role
                can&apos;t be modified.
              </p>
            </div>
          )}

          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permissions"
              className="w-full rounded-full border border-input bg-transparent py-1.5 pr-3.5 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="divide-y divide-border rounded-lg border border-border">
            {visibleCategories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between gap-4 px-3.5 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {category}
                </span>
                <Select
                  value={matrix[selectedRole][category]}
                  onValueChange={(value) =>
                    updateAccess(category, value as AccessLevel)
                  }
                  disabled={isAdmin}
                >
                  <SelectTrigger className="w-fit border-none bg-transparent py-1 pr-1.5 pl-2.5 text-sm text-muted-foreground shadow-none hover:bg-muted disabled:opacity-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {accessLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
