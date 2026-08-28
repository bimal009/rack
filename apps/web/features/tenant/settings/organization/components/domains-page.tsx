"use client"

import { useState } from "react"
import { Globe, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"

interface Domain {
  id: string
  host: string
  verified: boolean
}

const initialDomains: Domain[] = [
  { id: "dom_1", host: "book.chautarilabs.com", verified: true },
]

export function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [value, setValue] = useState("")

  function addDomain() {
    const host = value.trim()
    if (!host) return
    setDomains((prev) => [
      ...prev,
      { id: `dom_${Math.random().toString(36).slice(2, 8)}`, host, verified: false },
    ])
    setValue("")
    toast.success(`${host} added. Verify DNS to activate it.`)
  }

  function removeDomain(id: string) {
    setDomains((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Use your own domain for member-facing pages like booking and check-in.
      </p>

      <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="flex items-center justify-between gap-3 px-3.5 py-3"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {domain.host}
              </span>
              <Badge
                variant={domain.verified ? "default" : "secondary"}
                className="rounded-full"
              >
                {domain.verified ? "Verified" : "Pending DNS"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => removeDomain(domain.id)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Remove domain</span>
            </Button>
          </div>
        ))}
        {domains.length === 0 && (
          <p className="px-3.5 py-4 text-sm text-muted-foreground">
            No custom domains yet.
          </p>
        )}
      </div>

      <div className="flex max-w-md items-center gap-2">
        <Input
          placeholder="book.yourgym.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={addDomain}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </div>
  )
}
