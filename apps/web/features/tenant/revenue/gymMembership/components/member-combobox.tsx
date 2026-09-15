"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import type { User } from "@repo/types"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover"

import { useDebounce } from "@/hooks/use-debounce"
import { useMembersQuery } from "@/features/tenant/members/hooks/use-members"

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

interface MemberComboboxProps {
  tenant: string
  value: Pick<User, "id" | "name" | "email" | "image"> | null
  onChange: (member: Pick<User, "id" | "name" | "email" | "image"> | null) => void
  disabled?: boolean
}

export function MemberCombobox({ tenant, value, onChange, disabled = false }: MemberComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const members = useMembersQuery(tenant, {
    search: debouncedSearch || undefined,
    limit: 20,
  })

  const rows = members.data?.data ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          />
        }
      >
        {value ? (
          <span className="flex min-w-0 items-center gap-2">
            <Avatar className="size-5">
              <AvatarImage src={value.image ?? undefined} alt={value.name} />
              <AvatarFallback className="text-[10px]">
                {initials(value.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{value.name}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">Select member</span>
        )}
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search members..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {members.isLoading ? (
              <div className="p-3 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : (
              <>
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {rows.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={member.id}
                      onSelect={() => {
                        onChange({ id: member.id, name: member.user.name, email: member.user.email, image: member.user.image })
                        setOpen(false)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="size-6">
                        <AvatarImage
                          src={member.user.image ?? undefined}
                          alt={member.user.name}
                        />
                        <AvatarFallback className="text-[10px]">
                          {initials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{member.user.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {member.user.email}
                        </span>
                      </span>
                      {value?.id === member.id && <Check className="size-4 shrink-0" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
