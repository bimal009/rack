"use client"

import { useState } from "react"
import { Info, RotateCcw, Upload } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { Switch } from "@repo/ui/components/ui/switch"
import { cn } from "@repo/ui/lib/utils"

import {
  defaultNotifications,
  notificationChannels,
  notificationRoleNames,
  notificationTypes,
  type NotificationChannel,
  type NotificationMatrix,
  type NotificationRoleName,
} from "../lib/notifications-data"

const roleUserCounts: Record<NotificationRoleName, number> = {
  Admin: 1,
  Manager: 1,
  "Front Desk": 1,
  Instructor: 4,
  Member: 11,
}

export function NotificationsPage() {
  const [matrix, setMatrix] = useState<NotificationMatrix>(defaultNotifications)
  const [selectedRole, setSelectedRole] = useState<NotificationRoleName>("Admin")

  function toggleEnabled(key: string, enabled: boolean) {
    setMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [key]: { ...prev[selectedRole][key]!, enabled },
      },
    }))
  }

  function toggleChannel(key: string, channel: NotificationChannel) {
    setMatrix((prev) => {
      const row = prev[selectedRole][key]!
      const channels = row.channels.includes(channel)
        ? row.channels.filter((c) => c !== channel)
        : [...row.channels, channel]
      return {
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [key]: { ...row, channels },
        },
      }
    })
  }

  function toggleAllowChange(key: string, allowUsersToChange: boolean) {
    setMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [key]: { ...prev[selectedRole][key]!, allowUsersToChange },
      },
    }))
  }

  function applyToAll(key: string) {
    const setting = matrix[selectedRole][key]!
    setMatrix((prev) => {
      const next = { ...prev }
      for (const role of notificationRoleNames) {
        next[role] = { ...next[role], [key]: { ...setting } }
      }
      return next
    })
  }

  function resetToDefault() {
    setMatrix((prev) => ({
      ...prev,
      [selectedRole]: defaultNotifications[selectedRole],
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Set which notifications each role receives by default, and which of
        them users may change.
      </p>

      <div className="flex items-start gap-2.5 rounded-lg bg-primary/5 px-3.5 py-2.5 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          These are the defaults for users who have not changed a setting
          themselves. Turn off &quot;Allow users to change&quot; to fix a
          setting for everyone in the role, or use Apply to all to replace
          their existing preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Roles
          </p>
          <div className="flex flex-col gap-0.5">
            {notificationRoleNames.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                  selectedRole === role
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                )}
              >
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      selectedRole === role ? "text-primary" : "text-foreground"
                    )}
                  >
                    {role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {roleUserCounts[role]} user
                    {roleUserCounts[role] === 1 ? "" : "s"}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full font-normal">
                  Default
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              {selectedRole}
            </h2>
            <button
              type="button"
              onClick={resetToDefault}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset to default
            </button>
          </div>

          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {notificationTypes.map((type) => {
              const setting = matrix[selectedRole][type.key]!
              return (
                <div
                  key={type.key}
                  className="flex flex-col gap-3 px-3.5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {type.label}
                    </p>

                    <p className="mt-2 mb-1 text-xs text-muted-foreground">
                      Channels
                    </p>
                    <div className="flex items-center gap-1.5">
                      {notificationChannels.map((channel) => {
                        const active = setting.channels.includes(channel)
                        return (
                          <button
                            key={channel}
                            type="button"
                            disabled={!setting.enabled}
                            onClick={() => toggleChannel(type.key, channel)}
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                              active
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {channel}
                          </button>
                        )
                      })}
                    </div>

                    <label className="mt-2.5 flex w-fit items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={setting.allowUsersToChange}
                        onCheckedChange={(checked) =>
                          toggleAllowChange(type.key, checked === true)
                        }
                      />
                      Allow users to change
                    </label>
                  </div>

                  <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={(checked) =>
                        toggleEnabled(type.key, checked)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => applyToAll(type.key)}
                      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      <Upload className="size-3" />
                      Apply to all
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
